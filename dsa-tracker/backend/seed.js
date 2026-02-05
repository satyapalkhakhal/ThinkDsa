import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Topic from './models/Topic.js';
import Problem from './models/Problem.js';
import Progress from './models/Progress.js';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Topic.deleteMany({});
        await Problem.deleteMany({});
        await Progress.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create sample user
        const user = await User.create({
            name: 'Alex Johnson',
            email: 'alex@example.com',
            password: 'password123'
        });
        console.log('👤 Created sample user');

        // Create topics
        const topics = await Topic.create([
            {
                title: 'Arrays & Hashing',
                description: 'Master the fundamentals of array manipulation, slicing window techniques, and prefix sums efficiently.',
                icon: '[]',
                order: 1
            },
            {
                title: 'Two Pointers',
                description: 'Learn efficient two-pointer technique for solving array and string problems.',
                icon: '⚭',
                order: 2
            },
            {
                title: 'Stack',
                description: 'Understand stack data structure and its applications.',
                icon: '◈',
                order: 3
            },
            {
                title: 'Binary Search',
                description: 'Master binary search algorithm and its variations.',
                icon: '🔍',
                order: 4
            },
            {
                title: 'Linked List',
                description: 'Learn linked list operations and common patterns.',
                icon: '🔗',
                order: 5
            },
            {
                title: 'Trees',
                description: 'Explore tree data structures and traversal algorithms.',
                icon: '🌲',
                order: 6
            }
        ]);
        console.log('📚 Created topics');

        // Create problems for Arrays & Hashing
        const arraysProblems = await Problem.create([
            {
                topicId: topics[0]._id,
                title: 'Two Sum',
                difficulty: 'EASY',
                description: 'Find two numbers that add up to target.',
                links: {
                    leetcode: 'https://leetcode.com/problems/two-sum/',
                    youtube: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
                    article: 'https://www.geeksforgeeks.org/two-sum/'
                },
                order: 1
            },
            {
                topicId: topics[0]._id,
                title: 'Contains Duplicate',
                difficulty: 'EASY',
                description: 'Check if any value appears at least twice.',
                links: {
                    leetcode: 'https://leetcode.com/problems/contains-duplicate/',
                    youtube: 'https://www.youtube.com/watch?v=3OamzN90kPg'
                },
                order: 2
            },
            {
                topicId: topics[0]._id,
                title: 'Valid Anagram',
                difficulty: 'EASY',
                description: 'Given two strings s and t, return true if t is an anagram of s.',
                links: {
                    leetcode: 'https://leetcode.com/problems/valid-anagram/',
                    youtube: 'https://www.youtube.com/watch?v=9UtInBqnCgA'
                },
                order: 3
            },
            {
                topicId: topics[0]._id,
                title: 'Group Anagrams',
                difficulty: 'MEDIUM',
                description: 'Group strings that are anagrams of each other.',
                links: {
                    leetcode: 'https://leetcode.com/problems/group-anagrams/',
                    youtube: 'https://www.youtube.com/watch?v=vzdNOK2oB2E'
                },
                order: 4
            },
            {
                topicId: topics[0]._id,
                title: 'Top K Frequent Elements',
                difficulty: 'MEDIUM',
                description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
                links: {
                    leetcode: 'https://leetcode.com/problems/top-k-frequent-elements/',
                    youtube: 'https://www.youtube.com/watch?v=YPTqKIgVk-k'
                },
                order: 5
            },
            {
                topicId: topics[0]._id,
                title: 'Product of Array Except Self',
                difficulty: 'MEDIUM',
                description: 'Calculate the product of all elements except self.',
                links: {
                    leetcode: 'https://leetcode.com/problems/product-of-array-except-self/'
                },
                order: 6
            },
            {
                topicId: topics[0]._id,
                title: 'Trapping Rain Water',
                difficulty: 'HARD',
                description: 'Compute how much water can be trapped after raining.',
                links: {
                    leetcode: 'https://leetcode.com/problems/trapping-rain-water/',
                    youtube: 'https://www.youtube.com/watch?v=ZI2z5pq0TqA'
                },
                order: 7
            }
        ]);
        console.log('📝 Created problems for Arrays & Hashing');

        // Create sample progress for user
        await Progress.create([
            {
                userId: user._id,
                problemId: arraysProblems[0]._id,
                isCompleted: true
            },
            {
                userId: user._id,
                problemId: arraysProblems[1]._id,
                isCompleted: true
            },
            {
                userId: user._id,
                problemId: arraysProblems[6]._id,
                isCompleted: true
            }
        ]);
        console.log('✅ Created sample progress');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📧 Sample User Credentials:');
        console.log('   Email: alex@example.com');
        console.log('   Password: password123');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
