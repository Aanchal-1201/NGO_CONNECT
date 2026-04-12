require('dotenv').config();
const { User, NGO } = require('./models/index');
const { connectDB, sequelize } = require('./config/db');

const seedNGOs = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    // 1. Create Admin User
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@gmail.com' },
      defaults: {
        username: 'admin',
        password: '123456', // Auto-hashed by User model hook
        role: 'admin'
      }
    });

    if (adminCreated) {
      console.log("✅ Seeded Admin Account (admin@gmail.com)");
    } else {
      console.log("⚠️ Skipped Admin Account (already exists)");
    }

    // 2. Create a base NGO user for authentication purposes
    const [user] = await User.findOrCreate({
      where: { email: 'admin@ahmedabad-ngos.org' },
      defaults: {
        username: 'ahmedabad_ngos',
        password: 'hashed_password_placeholder', // Dummy password for seeding
        role: 'ngo'
      }
    });

    const ngosToSeed = [
      {
        name: "Humankind (NGO)",
        email: "contact@humankind-ngo.org",
        phone: "+91 9876543210",
        address: "2nd Floor, Nanakram Super Market",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "It was my best experience volunteering here, they are doing a great job.",
        registrationNumber: "NGO-HK-001",
        latitude: 23.0560,
        longitude: 72.5850, // Approx around Shahibaug / Subhash bridge
        userId: user.id
      },
      {
        name: "Narayan Seva Sansthan Ahmedabad",
        email: "ahmedabad@narayanseva.org",
        phone: "+91 8765432109",
        address: "Char Sala, 54-55, near Abhishek Society",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "This place complete meal as prasad. Great community service and feeding programs.",
        registrationNumber: "NGO-NSS-002",
        latitude: 23.0489, 
        longitude: 72.6105, // Approx Meghaninagar / Asarwa
        userId: user.id
      },
      {
        name: "Dot to Drawing Foundation (NGO)",
        email: "info@dottodrawing.org",
        phone: "+91 7654321098",
        address: "BRTS Bus Stop, 1643 kevdajlni chall, opp...",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "Non-governmental organization dedicated to arts, expression, and youth support.",
        registrationNumber: "NGO-D2D-003",
        latitude: 23.0450,
        longitude: 72.6350, // Approx Naroda Road
        userId: user.id
      },
      {
        name: "Friends Care Foundation",
        email: "care@friendscare.org",
        phone: "+91 6543210987",
        address: "Shahibaug Area",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "Supporting community development and taking care of the underprivileged.",
        registrationNumber: "NGO-FCF-004",
        latitude: 23.0520,
        longitude: 72.5950, // Shahibaug
        userId: user.id
      },
      {
        name: "Navrangpura Youth Trust",
        email: "youth@navrangpura.org",
        phone: "+91 5432109876",
        address: "Navrangpura Central",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "Youth empowerment and educational support.",
        registrationNumber: "NGO-NYT-005",
        latitude: 23.0365,
        longitude: 72.5519, // Navrangpura
        userId: user.id
      },
      {
        name: "Gujarat Law Society Aid",
        email: "aid@glsuniversity.ac.in",
        phone: "+91 6665554443",
        address: "GLS University Campus, Ellisbridge",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "Student-run legal and social aid foundation affiliated with GLS University.",
        registrationNumber: "NGO-GLS-006",
        latitude: 23.0305,
        longitude: 72.5592, // Exact GLS University coordinates
        userId: user.id
      },
      {
        name: "Ellisbridge Education Support",
        email: "support@ellisbridgeedu.org",
        phone: "+91 7778889990",
        address: "Opposite GLS Campus, Law Garden Road",
        city: "Ahmedabad",
        state: "Gujarat",
        description: "Providing books and educational material to underprivileged students in the Ellisbridge area.",
        registrationNumber: "NGO-EES-007",
        latitude: 23.0298,
        longitude: 72.5601, // Right next to GLS University / Law Garden
        userId: user.id
      }
    ];

    for (const ngoData of ngosToSeed) {
      const [ngo, created] = await NGO.findOrCreate({
        where: { registrationNumber: ngoData.registrationNumber },
        defaults: ngoData
      });
      if (created) {
        console.log(`✅ Seeded: ${ngo.name}`);
      } else {
        console.log(`⚠️ Skipped (already exists): ${ngo.name}`);
      }
    }

    console.log("🎉 Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedNGOs();
