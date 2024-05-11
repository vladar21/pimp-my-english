# Pimp My English

## Description
"Pimp My English" is an interactive e-commerce project designed to assist in learning English vocabulary through quizzes. This platform allows users to enhance their vocabulary by testing their knowledge of words and their definitions, as well as sharing their lexical creations with others.

## Technologies
- **Backend**: Python 3.12.3, Django 5.0
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (development), PostgreSQL (production)
- **Payment Processing**: Stripe API

## Features
### Authentication and User Roles
- **Subscribers**: Authorization on the platform is required only for subscribers. Subscribers have access to all platform features, including creating and editing word sets.
- **Guests**: Can use the service without registration or authorization, limited to accessing preset and shared word sets.

### Interactive Quizzes
- The quiz consists of preset or subscriber-shared word sets.
- Quizzes challenge users to choose the correct answers from given options based on word definitions.
- Each question has a time limit, and users can move to the next question by pressing the "Skip" button.

### Ratings
- Word sets are rated on a five-star system, which takes into account both user ratings and frequency of use.
- The overall rating of each word set is calculated as an average between user ratings and the automatically calculated usage rating.

## UX/UI
### Site Goals
The primary goal of "Pimp My English" is to create a motivating and accessible environment that encourages users to engage with English vocabulary through interactive quizzes. The platform aims to facilitate effective learning by allowing users to test, expand, and share their vocabulary knowledge.

### Design Choices
The design of "Pimp My English" is simple yet effective, focusing on user experience with intuitive navigation and modern controls. The interface is designed to be user-friendly, minimizing distractions and focusing on quiz interaction to enhance learning outcomes.

## User Stories

### As a Subscriber:
- I want to be able to create my own sets of words so that I can personalize my learning experience.
- I want to customize existing sets of words to better fit my vocabulary needs.
- I want to view statistics of all my games to track my learning progress.
- I want to share my word sets with others to help them learn.
- I want to participate in the rankings to see how I compare to other learners.
- I want to log into the site to access my personalized settings and word sets.
- I want to be able to edit and delete my word sets if needed.
- I want to review and edit my account information to keep my profile up-to-date.

### As a Guest:
- I want to access preset and shared word sets without registering so I can start learning immediately.
- I want to use the platform without any registration or login to quickly test my vocabulary skills.
- I want to see the basic statistics for my current session to monitor my immediate learning outcomes.

### As an Owner/Administrator:
- I want to manage the entire platform to ensure smooth operations and content quality.
- I want to add new word sets to expand the learning resources available.
- I want to edit existing word sets to ensure they are accurate and up-to-date.
- I want to remove inappropriate content or user accounts to maintain a safe and positive learning environment.
- I want to manage financial transactions and oversee the subscription process to ensure it runs smoothly.

### Wireframes
Wireframes for "Pimp My English" were developed to plan the layout and interaction of the web interface. [Link or description of where wireframes can be accessed] will provide insights into the design and functionality envisioned for the platform.

### Database Structure
The database for "Pimp My English" is structured to support a robust e-commerce and educational platform:
- **User**: Stores subscriber and guest information.
- **Word Sets**: Contains collections of words, each with definitions and usage examples.
- **Quizzes**: Links users to their quiz results and word sets used.
- **Ratings**: Manages the rating system for word sets, including user feedback and usage statistics.

## Testing
- Description of manual testing of site functionality.
- Plans to implement automated tests to improve development.

## Deployment
- Instructions for deployment on Heroku, including database setup and environment configuration.

## Acknowledgements
- Links to used resources, codes, images, and texts, citing authorship and sources.

## Future Features
- Expansion of functionality to include voice commands and multilingual word sets.
- Introduction of gamification elements to increase user engagement.

## License
This project is distributed under the MIT License.
