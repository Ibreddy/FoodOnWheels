const Business = require('../models/Business');

// Throttle dictionary to prevent spamming DB on high frequency GPS updates
const lastDbUpdateMap = new Map();
const DB_UPDATE_INTERVAL_MS = 5000; // Update Mongo every 5s max per truck

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket client connected: ${socket.id}`);

    // Join room (e.g. 'business:b1', 'order:o123', 'user:u456')
    socket.on('join:room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('leave:room', (room) => {
      socket.leave(room);
    });

    // Mobile Vendor Live GPS Broadcast
    socket.on('vendor:location:update', async (data) => {
      try {
        const { businessId, lat, lng, speed, heading } = data;
        if (!businessId || lat === undefined || lng === undefined) return;

        const liveLocation = {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          speed: parseFloat(speed || 0),
          heading: parseFloat(heading || 0),
          isLive: true,
          lastUpdated: new Date()
        };

        // Broadcast real-time location immediately to all subscribers in room & public map
        io.to(`business:${businessId}`).emit('vendor:location:updated', {
          businessId,
          liveLocation
        });
        io.emit('vendor:location:updated', { businessId, liveLocation });

        // Throttle database write to avoid bottleneck
        const lastUpdate = lastDbUpdateMap.get(businessId) || 0;
        const now = Date.now();
        if (now - lastUpdate > DB_UPDATE_INTERVAL_MS) {
          lastDbUpdateMap.set(businessId, now);
          await Business.findByIdAndUpdate(businessId, {
            liveLocation,
            location: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            }
          });
        }
      } catch (err) {
        console.error('Error handling vendor:location:update socket event:', err);
      }
    });

    // Order status update event
    socket.on('order:status:update', (data) => {
      const { orderId, status } = data;
      if (orderId && status) {
        io.to(`order:${orderId}`).emit('order:status:updated', { orderId, status });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
