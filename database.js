// database.js - COMPLETE VERSION
const MotionTechDB = {
    DB_KEY: 'motionTechUserDB',
    
    // Initialize database
    init: function() {
        console.log("🚀 Initializing Motion Tech Database...");
        
        if (!localStorage.getItem(this.DB_KEY)) {
            console.log("📁 No database found. Creating new database...");
            this.createDefaultDatabase();
        } else {
            console.log("✅ Database found and loaded");
        }
        
        const userCount = this.getUserCount();
        console.log(`📊 Total users: ${userCount}`);
        
        return this.getUsers();
    },
    
    // Create default database
    createDefaultDatabase: function() {
        const defaultUsers = [
            {
                id: 1,
                username: "admin",
                email: "admin@motiontech.com",
                password: "admin123",
                firstName: "System",
                lastName: "Administrator",
                name: "System Administrator",
                role: "admin",
                company: "Motion Tech",
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            },
            {
                id: 2,
                username: "motion",
                email: "motiontech.com",
                password: "motion123",
                firstName: "Demo",
                lastName: "Client",
                name: "Demo Client",
                role: "client",
                company: "Demo Corp",
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            }
        ];
        
        localStorage.setItem(this.DB_KEY, JSON.stringify(defaultUsers));
        console.log("✅ Default database created with 2 users");
    },
    
    // Get all users
    getUsers: function() {
        try {
            const usersJSON = localStorage.getItem(this.DB_KEY);
            if (!usersJSON) return [];
            return JSON.parse(usersJSON);
        } catch (error) {
            console.error("❌ Error reading database:", error);
            return [];
        }
    },
    
    // Save users to database
    saveUsers: function(users) {
        try {
            users.sort((a, b) => a.id - b.id);
            localStorage.setItem(this.DB_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error("❌ Error saving database:", error);
            return false;
        }
    },
    
    // Add new user
    addUser: function(userData) {
        console.log("➕ Adding new user:", userData.username);
        
        const users = this.getUsers();
        
        // Validate required fields
        if (!userData.username || !userData.email || !userData.password) {
            return { success: false, message: "Missing required fields" };
        }
        
        // Check for duplicate username
        const existingUsername = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
        if (existingUsername) {
            return { success: false, message: "Username already exists" };
        }
        
        // Check for duplicate email
        const existingEmail = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existingEmail) {
            return { success: false, message: "Email already registered" };
        }
        
        // Generate ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        // Create user object
        const newUser = {
            id: newId,
            username: userData.username.trim(),
            email: userData.email.trim().toLowerCase(),
            password: userData.password,
            firstName: userData.firstName ? userData.firstName.trim() : '',
            lastName: userData.lastName ? userData.lastName.trim() : '',
            name: userData.firstName && userData.lastName 
                ? `${userData.firstName.trim()} ${userData.lastName.trim()}`
                : userData.username,
            role: "client",
            company: userData.company ? userData.company.trim() : "",
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to database
        const saved = this.saveUsers(users);
        
        if (saved) {
            console.log("✅ User added successfully:", newUser.username);
            return { 
                success: true, 
                user: newUser,
                message: "Registration successful!" 
            };
        } else {
            return { success: false, message: "Failed to save user data" };
        }
    },
    
    // Find user by username
    findUserByUsername: function(username) {
        const users = this.getUsers();
        return users.find(user => 
            user.username.toLowerCase() === username.toLowerCase().trim()
        );
    },
    
    // Find user by email
    findUserByEmail: function(email) {
        const users = this.getUsers();
        return users.find(user => 
            user.email.toLowerCase() === email.toLowerCase().trim()
        );
    },
    
    // Authenticate user
    authenticate: function(identifier, password) {
        const users = this.getUsers();
        
        // Find user by username or email
        const user = users.find(user => 
            (user.username.toLowerCase() === identifier.toLowerCase().trim() || 
             user.email.toLowerCase() === identifier.toLowerCase().trim()) &&
            user.isActive === true
        );
        
        if (!user) {
            return { success: false, message: "Invalid username/email" };
        }
        
        if (user.password !== password) {
            return { success: false, message: "Invalid password" };
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);
        
        return { success: true, user: user };
    },
    
    // Get user count
    getUserCount: function() {
        return this.getUsers().length;
    },
    
    // Check username availability
    isUsernameAvailable: function(username) {
        return !this.findUserByUsername(username);
    },
    
    // Check email availability
    isEmailAvailable: function(email) {
        return !this.findUserByEmail(email);
    },
    
    // Debug function - FIXED NAME
    debug: function() {
        console.log("=== DATABASE DEBUG INFO ===");
        console.log(`Database Key: ${this.DB_KEY}`);
        console.log(`Total Users: ${this.getUserCount()}`);
        
        const users = this.getUsers();
        if (users.length === 0) {
            console.log("No users in database");
        } else {
            users.forEach((user, index) => {
                console.log(`User ${index + 1}:`, {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                });
            });
        }
        
        console.log("===========================");
        return users;
    },
    
    // Clear database (for testing)
    clear: function() {
        localStorage.removeItem(this.DB_KEY);
        console.log("🗑️ Database cleared");
        this.init();
    }
};

// Auto-initialize
MotionTechDB.init();
window.MotionTechDB = MotionTechDB;


console.log("✅ Motion Tech Database System Ready!");
