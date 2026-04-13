require("dotenv").config();
const { sequelize } = require("../config/db");
const { User, NGO, HelpRequest, Notification, PlatformSettings } = require("../models");

const usersData = [
  { id: 1, username: 'testai', email: 'testai@ngo.com', password: '$2b$10$vaIbkmhyv01ra9qIBbS1CePeDPL91bvvgd1Kdm2OD3pZIldZngdCm', role: 'user', createdAt: '2026-03-16 08:35:00', updatedAt: '2026-03-16 08:35:00' },
  { id: 2, username: 'user1774422476972', email: 'user1774422476972@test.com', password: '$2b$10$6avDq6xnZ4lJF5BBW8w4yuirdRPdIildZjoH.g4hnlpU2RCi5aHgi', role: 'user', createdAt: '2026-03-25 07:07:56', updatedAt: '2026-03-25 07:07:56' },
  { id: 3, username: 'aanchal', email: 'aanchal@gmail.com', password: '$2b$10$qrAgORp17624DluCC0ZyHufyysEHmggp/tAIsRB1A0oWBH6JsgyDW', role: 'user', createdAt: '2026-03-25 07:10:27', updatedAt: '2026-03-25 07:10:27' },
  { id: 5, username: 'admin', email: 'admin@gmail.com', password: '$2b$10$KbWhnIeWu2/W3xo5ZLnfYeVqTvA3HMPlwQMHkC/TRDaa7dsYcxYXO', role: 'admin', createdAt: '2026-03-25 07:25:10', updatedAt: '2026-03-25 07:25:10' },
  { id: 6, username: 'ngo', email: 'ngo@gmail.com', password: '$2b$10$.TrMhN0jMBmm4uZWtw/Rw.FcDQDFHYz8Y6ywcA/Nrp8vQT0DKpHkq', role: 'ngo', createdAt: '2026-03-25 07:48:47', updatedAt: '2026-03-25 07:48:47' },
  { id: 7, username: 'humankind', email: 'admin@ahmedabad-ngos.org', password: '$2b$10$0VcxKr4RS/yswHC922xFdunKLq.jFgjbAjhQA2s.pMgNpX.Jp6ama', role: 'ngo', createdAt: '2026-03-27 02:12:29', updatedAt: '2026-03-27 02:12:29' },
  { id: 8, username: 'Shivam', email: 'svelani27@gmail.com', password: '$2b$10$boyzvZXOrz1/GgY6prdKZ.ivRM6xM.MI8.TtIlwG9HQ5aKaGsM0Fu', role: 'user', createdAt: '2026-04-11 06:04:22', updatedAt: '2026-04-11 06:04:22' }
];

const ngosData = [
  { id: 1, name: 'Humankind (NGO)', email: 'contact@humankind-ngo.org', phone: '+91 9876543210', address: '2nd Floor, Nanakram Super Market', city: 'Ahmedabad', state: 'Gujarat', description: 'It was my best experience volunteering here, they are doing a great job.', registrationNumber: 'NGO-HK-001', latitude: 23.056, longitude: 72.585, isActive: true, createdAt: '2026-03-25 07:22:31', updatedAt: '2026-03-25 07:58:44', userId: null },
  { id: 2, name: 'Narayan Seva Sansthan Ahmedabad', email: 'ahmedabad@narayanseva.org', phone: '+91 8765432109', address: 'Char Sala, 54-55, near Abhishek Society', city: 'Ahmedabad', state: 'Gujarat', description: 'This place complete meal as prasad. Great community service and feeding programs.', registrationNumber: 'NGO-NSS-002', latitude: 23.0489, longitude: 72.6105, isActive: true, createdAt: '2026-03-25 07:22:31', updatedAt: '2026-03-25 07:58:45', userId: null },
  { id: 3, name: 'Dot to Drawing Foundation (NGO)', email: 'info@dottodrawing.org', phone: '+91 7654321098', address: 'BRTS Bus Stop, 1643 kevdajlni chall, opp...', city: 'Ahmedabad', state: 'Gujarat', description: 'Non-governmental organization dedicated to arts, expression, and youth support.', registrationNumber: 'NGO-D2D-003', latitude: 23.045, longitude: 72.635, isActive: true, createdAt: '2026-03-25 07:22:31', updatedAt: '2026-03-25 07:22:31', userId: null },
  { id: 4, name: 'Friends Care Foundation', email: 'care@friendscare.org', phone: '+91 6543210987', address: 'Shahibaug Area', city: 'Ahmedabad', state: 'Gujarat', description: 'Supporting community development and taking care of the underprivileged.', registrationNumber: 'NGO-FCF-004', latitude: 23.052, longitude: 72.595, isActive: true, createdAt: '2026-03-25 07:22:31', updatedAt: '2026-03-25 07:22:31', userId: null },
  { id: 5, name: 'Navrangpura Youth Trust', email: 'youth@navrangpura.org', phone: '+91 5432109876', address: 'Navrangpura Central', city: 'Ahmedabad', state: 'Gujarat', description: 'Youth empowerment and educational support.', registrationNumber: 'NGO-NYT-005', latitude: 23.0365, longitude: 72.5519, isActive: true, createdAt: '2026-03-25 07:22:31', updatedAt: '2026-03-25 07:22:31', userId: null },
  { id: 6, name: 'Gujarat Law Society Aid', email: 'aid@glsuniversity.ac.in', phone: '+91 6665554443', address: 'GLS University Campus, Ellisbridge', city: 'Ahmedabad', state: 'Gujarat', description: 'Student-run legal and social aid foundation affiliated with GLS University.', registrationNumber: 'NGO-GLS-006', latitude: 23.0305, longitude: 72.5592, isActive: true, createdAt: '2026-03-25 07:23:54', updatedAt: '2026-03-25 07:23:54', userId: null },
  { id: 7, name: 'Ellisbridge Education Support', email: 'support@ellisbridgeedu.org', phone: '+91 7778889990', address: 'Opposite GLS Campus, Law Garden Road', city: 'Ahmedabad', state: 'Gujarat', description: 'Providing books and educational material to underprivileged students in the Ellisbridge area.', registrationNumber: 'NGO-EES-007', latitude: 23.0298, longitude: 72.5601, isActive: true, createdAt: '2026-03-25 07:23:54', updatedAt: '2026-03-27 02:20:50', userId: 7 }
];

const helpRequestsData = [
  { id: 1, username: 'user1774422476972', helpType: 'food', description: 'Need food supplies urgently for 5 people', imageUrls: '["uploads/1774422477059-dummy.jpg"]', latitude: 19.076, longitude: 72.8777, status: 'pending', priority: 'high', createdAt: '2026-03-25 07:07:57', updatedAt: '2026-03-25 07:07:57', createdById: 2, assignedToId: null },
  { id: 2, username: 'aanchal', helpType: 'clothes', description: 'need cloths kids are naked here', imageUrls: '["uploads/1774422657466-Screenshot2026-03-25at10.35.39â€¯AM.png"]', latitude: 23.0581, longitude: 72.6148, status: 'resolved', priority: 'high', createdAt: '2026-03-25 07:10:57', updatedAt: '2026-03-27 02:25:15', createdById: 3, assignedToId: 7 },
  { id: 3, username: 'aanchal', helpType: 'food', description: 'need food near me a guy is hungry from while', imageUrls: '["uploads/1774577756787-download.jpeg"]', latitude: 23.0581, longitude: 72.6153, status: 'pending', priority: 'medium', createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', createdById: 3, assignedToId: null }
];

const notificationsData = [
  { id: 1, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 1, helpRequestId: 3 },
  { id: 2, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 2, helpRequestId: 3 },
  { id: 3, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 3, helpRequestId: 3 },
  { id: 4, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 4, helpRequestId: 3 },
  { id: 5, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 5, helpRequestId: 3 },
  { id: 6, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 6, helpRequestId: 3 },
  { id: 7, message: 'New food request near your location', isRead: false, createdAt: '2026-03-27 02:15:56', updatedAt: '2026-03-27 02:15:56', ngoId: 7, helpRequestId: 3 }
];

async function migrate() {
  try {
    console.log("🚀 Starting Migration to PostgreSQL...");
    
    // 1. Sync database (Drop and recreate)
    await sequelize.sync({ force: true });
    console.log("✅ Tables created.");

    // 2. Insert Users (Disable hooks to keep original hashes)
    await User.bulkCreate(usersData, { hooks: false });
    console.log("✅ Users migrated.");

    // 3. Insert NGOs
    await NGO.bulkCreate(ngosData);
    console.log("✅ NGOs migrated.");

    // 4. Insert HelpRequests
    await HelpRequest.bulkCreate(helpRequestsData);
    console.log("✅ HelpRequests migrated.");

    // 5. Insert Notifications
    await Notification.bulkCreate(notificationsData);
    console.log("✅ Notifications migrated.");

    console.log("✨ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await sequelize.close();
  }
}

migrate();
