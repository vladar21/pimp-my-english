# Pimp My English && Learn By Gaming!

[View the live project - Click here.](https://pme-8f6d8d60e106.herokuapp.com/)

**Pimp My English** is an interactive educational platform designed to enhance your English vocabulary through engaging quizzes. The platform allows users to test their knowledge of words, create personalized word sets, and access a variety of quizzes tailored to different levels of language proficiency.

This README file provides an overview of the project, detailing its purpose, features, structure, and setup instructions.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Future Features](#future-features)
4. [Technologies](#technologies)
5. [Project Architecture](#project-architecture)
6. [User Stories](#user-stories)
7. [Agile Development Plan](#agile-development-plan)
8. [UX/UI Design](#uxui-design)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Acknowledgements](#acknowledgements)
12. [License](#license)

---

## Introduction

**Pimp My English** is more than just a vocabulary quiz platform; it is an immersive learning environment where users can:

- **Test their vocabulary knowledge**: Users can take quizzes that challenge their understanding of word definitions and usage.
- **Create personalized word sets**: Subscribers have the ability to create and customize word sets to focus on their individual learning needs.
- **Responsive Design**: Thanks to the responsive design implemented in the project, users can comfortably interact with quizzes on various devices, from large screens to smartphone displays.
- **Automatic Word Set Ratings**: Word sets are automatically rated based on the number of times they have been started. The ratings are available to users when selecting a word set, providing a quick and easy way to identify popular and frequently used sets.

The platform aims to provide a comprehensive learning tool that is both educational and entertaining, fostering a deeper engagement with the English language.

---

## Features

### User Authentication and Roles
- **Subscribers**: Authorized users with paid subscriptions can create and edit word sets, access their profile with detailed subscription information, and manage word sets they have created.
- **Guests**: Unregistered users can access preset and shared word sets to quickly test their vocabulary skills without registration.
- **Admin**: Administrators have full control over platform content and user management, including subscription plans and user roles.

    <img src="static/readme/images/user_authentification_and_roles.png" alt="User Authentication and Roles" width="600">

### Interactive Quizzes
- **Engaging Quizzes**: Quizzes challenge users to guess words by their definitions, with each question having a time limit.
- **Variety of Word Sets**: Users can select from a variety of word sets based on their proficiency level and interests.
- **Real-time Feedback**: Users receive immediate feedback in the form of a results table displayed in the browser for the current session, allowing them to track their estimated time, correct and incorrect answers.

    <img src="static/readme/images/interactive_quizzes.png" alt="User Authentication and Roles" width="600">

### Word Set Management
- **Create and Edit Word Sets**: Subscribers can create personalized word sets and edit existing ones.
- **Rating System**: Word sets can be rated automatically based on the number of times they have been started, with the ratings displayed when selecting a word set.
- **Sharing and Collaboration**: Users share their word sets with others and see immediate feedback through the word set ratings.

    <img src="static/readme/images/word_set_managment.png" alt="User Authentication and Roles" width="600">

### Subscription and E-Commerce Integration
- **Subscription Plans**: Users can purchase subscriptions to create and customize word sets.
- **Secure Payments**: Integration with Stripe ensures secure payment processing for subscriptions.
- **Subscription Management**: Users can manage their subscription plans, including renewals and cancellations with just a few clicks, thanks to Stripe integration and a well-thought-out commercial component.

    <img src="static/readme/images/subscriptions_and_e-commerce.png" alt="User Authentication and Roles" width="600">

### Newsletter Feature Integration
- **Automatic Subscription Management**: All new subscribers are automatically added to our Mailchimp mailing list.
- **Seamless Mailchimp Integration**: As users subscribe to our service, their email addresses are instantly synced with Mailchimp.
- **Effortless Newsletter Distribution**: Subscribers receive regular updates and newsletters through Mailchimp without any additional setup.

    <img src="static/readme/images/newsletters_and_mailchimp.png" alt="User Authentication and Roles" width="600">

### Facebook Page Mockup
- **Project Presentation**: Specific mockup showcasing the "Pimp My English" project.
- **Header and Profile**: Features the project logo and navigation links for easy access to various sections.
- **Posts Section**: Engaging posts with images displaying the app's interface on multiple devices, along with project updates.
- **About Section**: Provides a brief description of the project and contact details.
- **Photos and Media**: Includes a gallery with app screenshots and user testimonials.
- **Community Engagement**: Contains links to liked pages and options for user interaction through comments, likes, and shares.


    <img src="static/images/PME_Facebook_Mockup.png" width="600" alt="Facebook Page Mockup"/>

---

## Future Features

We have exciting plans to enhance the learning experience on our platform. Here are the upcoming features we are planning to implement:

### Multi-language Quizzes

To make our platform more inclusive and cater to a wider audience, we plan to introduce multi-language quizzes. This feature will allow users to take quizzes in different languages, starting with the Irish language. This will help users learn and practice new languages, expanding their vocabulary and language skills beyond English.

#### Planned Languages:
1. **Irish (Gaeilge)**: As our first additional language, users will be able to take quizzes in Irish, covering vocabulary and grammar specific to the Irish language.

### Enhanced Quiz Modes

We are planning to introduce new quiz modes to provide a more diverse and engaging learning experience. These modes will include:
1. **Reverse Quizzes**: In this mode, users will guess definitions based on the given words. This will enhance their understanding and retention of word meanings.
2. **Audio Quizzes**: Users will listen to audio pronunciations and guess the corresponding words. This mode aims to improve listening skills and pronunciation accuracy.

---

## Technologies

### Backend
- **Python**: 3.12.3
- **Django**: 5.0.6
  - **Django REST framework**: 3.15.1
  - **dj-database-url**: 0.5.0 (Database configuration)
  - **django-allauth**: 0.63.3 (Security and Authentication)
  - **sqlparse**: 0.5.0 (SQL parsing for Django)
  - **asgiref**: 3.8.1 (ASGI support for Django)

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

### Database
- **PostgreSQL**
- **psycopg2-binary**: 2.9.9 (PostgreSQL database adapter)

### Payment Processing
- **Stripe API**: 9.12.0

### Email Services
- **MailChimp**: 3.0.21

### Security and Authentication
- **django-allauth**: 0.63.3
- **PyJWT**: 2.8.0

### Configuration Management
- **python-decouple**: 3.8
- **python-dotenv**: 1.0.1

### Request Handling
- **requests**: 2.32.3
- **urllib3**: 2.2.2

### Static Files Management
- **whitenoise**: 6.7.0

### Web Server
- **gunicorn**: 20.1.0

### Other Dependencies
- **certifi**: 2024.6.2 (Certificate validation)
- **cffi**: 1.16.0 (Foreign Function Interface for Python)
- **charset-normalizer**: 3.3.2 (Encoding detection)
- **cryptography**: 42.0.8 (Cryptographic recipes and primitives)
- **idna**: 3.7 (Internationalized Domain Names in Applications)
- **tzdata**: 2024.1 (Time zone database)
- **typing_extensions**: 4.11.0 (Backport of Python typing features)

---

## Project Architecture

### Project Structure

The **Pimp My English** project is organized into several Django applications and directories, each serving a specific purpose. Below is an overview of the main components and their functionalities:

- **accounts**: Manages user authentication, profiles, and email templates for various account-related actions such as signup, login, and password reset.

- **admin_app**: Provides administrative functionalities, including managing users and content.

- **pimp_my_english**: The main application configuration and settings for the Django project.
  - **settings.py**: Configures project settings.
  - **urls.py**: Defines the URL routing for the project.

- **quizzes**: Manages the quiz functionality, including creating and taking quizzes.

- **subscriptions**: Manages subscription plans, payments, and user access control based on subscriptions.

- **wordsets**: Manages word sets, including creating, editing, and rating word sets.
  - **utils.py**: Contains utility functions, including the rating calculation.

- **static**: Contains static files such as CSS, JavaScript, and images.
  - **css**: Stylesheets for the project.
  - **js**: JavaScript files for interactivity.
  - **images**: Images used in the project, including logos and icons.

- **templates**: Global templates used across the project.
  - **base.html**: The base template for the project.
  - **home.html**: The homepage template.
  - **landing.html**: The landing page template.
  - **contact.html**: The contact page template.

### Key Functionalities

- **User Authentication and Roles**:
  - Managed by the `accounts` application.
  - Supports subscriber, guest, and admin roles with different access levels.

- **Interactive Quizzes**:
  - Managed by the `quizzes` application.
  - Includes engaging quizzes with real-time feedback and a variety of word sets.

- **Word Set Management**:
  - Managed by the `wordsets` application.
  - Allows creating, editing, rating, and sharing word sets.

- **Subscription and E-Commerce Integration**:
  - Managed by the `subscriptions` application.
  - Supports subscription plans, secure payments via Stripe, and easy subscription management.

This architecture ensures a modular and scalable project structure, making it easy to manage and extend the functionalities of the **Pimp My English** platform.

### Database Structure

The **Pimp My English** project uses a PostgreSQL database to manage various aspects of the application, including users, quizzes, subscriptions, and word sets. Below is an overview of the main models and their relationships.

#### Models Overview

##### User Models

- **User**: Extends the default Django user model to include additional fields like `is_subscriber`, `email_verified`, and `role`. 
- **Admin**: Represents an admin user with a specific role, linked to the `User` model.

##### Quiz Models

- **Quiz**: Represents a quiz taken by a user, linked to a specific word set.
- **QuizResult**: Stores the results of a quiz.
- **QuizSettings**: Stores settings for quizzes, such as word count and CEFR levels.

##### Subscription Models

- **Subscription**: Represents a user's subscription plan, including details like the Stripe subscription ID and whether the subscription is active.
- **Payment**: Stores payment information related to a subscription.

##### Word Set Models

- **WordSet**: Represents a collection of words with a name, description, rating, and other metadata. Linked to the `User` model for the creator and the `Admin` model for approval.
- **Word**: Represents a single word with additional metadata like language code, country code, word type, and CEFR level.
- **Definition**: Stores definitions for words.

### UML Diagram

<img src="static/readme/images/UML_diagram.png" width="800" alt="HESO db diagramm">

```plantuml
@startuml
class User {
  - is_subscriber: Boolean
  - email_verified: Boolean
  - role: String
  - created_at: DateTime
}

class Admin {
  - role: String
}

class Quiz {
  - score: Integer
  - completed_at: DateTime
}

class QuizResult {
  - score: Integer
  - completed_at: DateTime
}

class QuizSettings {
  - word_count: Integer
  - cefr_levels: List
  - word_types: List
}

class Subscription {
  - stripe_subscription_id: String
  - is_active: Boolean
  - created_at: DateTime
  - updated_at: DateTime
  - subscription_period: String
  - name: String
}

class Payment {
  - stripe_payment_id: String
  - amount: Decimal
  - created_at: DateTime
}

class WordSet {
  - name: String
  - description: String
  - rating: Float
  - start_count: Integer
  - author_username: String
  - author_email: String
}

class Word {
  - text: String
  - language_code: String
  - country_code: String
  - word_type: String
  - cefr_level: String
  - audio_data: Binary
  - image_data: Binary
  - created_at: DateTime
  - updated_at: DateTime
}

class Definition {
  - definition: Text
  - created_at: DateTime
  - updated_at: DateTime
}

User "1" -- "1" Admin
User "1" -- "*" Quiz
User "1" -- "*" QuizResult
User "1" -- "*" Subscription
Subscription "1" -- "*" Payment
WordSet "1" -- "*" Word : contains
Word "1" -- "*" Definition
WordSet "1" -- "1" User : created_by
WordSet "1" -- "0..1" Admin : approved_by
Quiz "1" -- "*" QuizResult
Quiz "1" -- "1" WordSet
@enduml
```

---

## User Stories

### As a Subscriber:
- I want to create my own sets of words to personalize my learning experience.
- I want to customize existing sets of words to better fit my vocabulary needs.
- I want to share my word sets with others to help them learn.
- I want to participate in the ranking of word sets to see how my contributions compare to those of other learners.
- I want to log into the site to access my subscriptions settings and word sets.
- I want to edit and delete my word sets if needed.
- I want to easy purchase a subscription to access additional features and word sets.
- I want to manage my subscription and payment details securely.

### As a Guest:
- I want to access preset and shared word sets without registering to start learning immediately.
- I want to use the platform without registration or login to quickly test my vocabulary skills.
- I want to understand the benefits of becoming a subscriber and the available subscription options.

### As a Subscriber Or a Guest:
- I want to see basic statistics for my current session to monitor my immediate learning outcomes.
- I want to easily subscribe to project newsletters to stay updated with new features and updates.
- I want to be able to ask questions and provide feedback to improve the platform.
- I want to see before quiz start the ratings of word sets to make a more informed choice.

### As an Admin:
- I want to manage the entire platform to ensure smooth operations and content quality.
- I want to remove inappropriate content or user accounts to maintain a safe and positive learning environment.

---

## Agile Development Plan

The development of PimpMyEnglish is structured into sprints, with each sprint targeting specific tasks for a focused and incremental development approach. Below is the sprint schedule along with their respective tasks.

``Current version of Agile plane`` by [link](https://github.com/users/vladar21/projects/12)

### Sprint Schedule

#### Sprint 1: Initial Setup and User Management
**Duration:** 4 days (May 21, 2024 - May 24, 2024)

**Goals:**
- Set up the initial project structure.
- Implement user authentication and authorization.

**User Stories:**
- As a Subscriber, I want to log into the site to access my subscriptions settings and word sets.
- As an Admin, I want to manage the entire platform to ensure smooth operations and content quality.

**Tasks and Dates:**
- Create Django Project (May 21, 2024)
  - **Commit:** 8e1dbd27c03d1191f53efa1a7c2d85d5e6930d08
  - **Description:** Create Django project pimp_my_english.
- Set Up Database and Static Files (May 21, 2024)
  - **Commit:** 58a9ddb3617504a518c25a4c7452ea62895fd37f
  - **Description:** Add to settings databases, static and media config.
- Create Initial Apps (May 21, 2024)
  - **Commit:** f831961297880aa9be75791edacfeb2febe3a004
  - **Description:** Create apps accounts, subscriptions, wordsets, quizzes, admin.
- Set Up URLs and Models (May 21, 2024)
  - **Commit:** 7569677871a513c08e50efb2bf1add405c1fb677
  - **Description:** Add URLs to all apps.
  - **Commit:** c913d511160abe05826bcc1db2b5258227bde63d
  - **Description:** Add models.
- Add Static Assets (May 24, 2024)
  - **Commit:** 7e3d3f311a8eaa4c89ea1b3896d71c4092bf1283
  - **Description:** Add CSS, fonts, images, JS, and sound folders to static folder.


#### Sprint 2: Frontend Base and Authentication
**Duration:** 4 days (May 25, 2024 - May 28, 2024)

**Goals:**
- Develop the basic frontend structure.
- Implement user authentication and authorization.

**User Stories:**
- As a Subscriber, I want to log into the site to access my subscriptions settings and word sets.
- As an Admin, I want to manage the entire platform to ensure smooth operations and content quality.

**Tasks:**
- Create Base Templates (May 25, 2024)
  - **Commit:** 25ed94eb06bf9dad0b7762d6fef55d5edb5618df
  - **Description:** Add templates base, landing, register.
- Set Up Frontend Base (May 25, 2024)
  - **Commit:** d217c1b32b26403c95761c4dff1bc838cb7a13d0
  - **Description:** Add frontend base and landing pages.
- User Authentication (May 26, 2024)
  - **Commit:** f3f4749633e310b4050bb82ec206bf5450a0d36c
  - **Description:** Make migrations.
  - **Commit:** c588bc6509f806257be0e4cf860e0e59fe6fa8ce
  - **Description:** Add auth backend.
- User Authorization (May 27, 2024)
  - **Commit:** baa16c076ac898fddbc932317c3bc76656e62764
  - **Description:** Add users app for user and auth management.
- Finalize User Management (May 28, 2024)
  - **Commit:** c30f77bca3d2bf2fba219ea4195cd4f74cc1adb9
  - **Description:** Remove users app.


#### Sprint 3: Wordsets and Quiz Basics
**Duration:** 4 days (May 29, 2024 - June 2, 2024)

**Goals:**
- Implement wordset management.
- Develop basic quiz functionality.

**User Stories:**
- As a Subscriber, I want to create my own sets of words to personalize my learning experience.
- As a Subscriber, I want to customize existing sets of words to better fit my vocabulary needs.

**Tasks:**
- Add Wordset Models and Forms (May 29, 2024)
  - **Commit:** 4b6599621781cd008c27c0d372ddd60003da3bcd
  - **Description:** Update update_word_set to create_or_update_word_set.
- Implement Wordset CRUD (May 30, 2024)
  - **Commit:** cf00ae8116be73f7d40f19dda4a78ae1b7bf596c
  - **Description:** Add delete word feature.
- Develop Quiz Functionality (June 1, 2024)
  - **Commit:** 6bca279e17926eab2f7c433f3a0fe766ce8cdcf3
  - **Description:** Create functionality start quiz with different wordsets.
- Create Wordset Select Feature (June 2, 2024)
  - **Commit:** d123b6f40284f74b2bb467f21d9088ff6d3591ff
  - **Description:** Add wordset select to start display.
- Enhance Wordset Features (June 2, 2024)
  - **Commit:** 5cb9dbe50945553d82d0c6c3fa4947e2a0a0173
  - **Description:** Problem with update select in settings form after create new word set.


#### Sprint 4: Styling and UI Improvements
**Duration:** 5 days (June 3, 2024 - June 7, 2024)

**Goals:**
- Improve the user interface.
- Add styling to various components.

**User Stories:**
- As a Subscriber, I want to customize existing sets of words to better fit my vocabulary needs.
- As a Guest, I want to access preset and shared word sets without registering to start learning immediately.

**Tasks:**
- Add Common Styles (June 3, 2024)
  - **Commit:** 8369e5a2450f4e7ea44368c4c40a4890fa80874b
  - **Description:** Improve some common styles.
- Style Wordset Modal (June 4, 2024)
  - **Commit:** 79f23bfe9db83da01184f59368aa8c2ef338b5ae
  - **Description:** Add create wordsets modal window.
- Enhance Home Page Styles (June 5, 2024)
  - **Commit:** 91f70e99f844c5d89607ad747db1312ca253e6e5
  - **Description:** Improve home page styles.
- Style Quiz Settings (June 6, 2024)
  - **Commit:** 3985779e591845ae8ade0992efd97da0ec3f098c
  - **Description:** Dynamically create data for Settings page.
- Finalize UI Improvements (June 7, 2024)
  - **Commit:** 4a93ef77b4be2617b4733f68b544f2a5c174d314
  - **Description:** Add Gmail config for send emails.


#### Issue для Sprint 5: Advanced Features and Feedback
**Duration:** 4 days (June 8, 2024 - June 11, 2024)

**Goals:**
- Implement advanced features for wordsets and quiz functionality.
- Set up feedback and contact functionalities.

**User Stories:**
- As a Subscriber or Guest, I want to be able to ask questions and provide feedback to improve the platform.

**Tasks:**
- Implement Advanced Quiz Features (June 8, 2024)
  - **Commit:** c4c7343093e7166e7eeb2228f41fffa3b29a3f4e
  - **Description:** Update from get to post fetch quiz data method.
- Set Up Feedback and Contact Page (June 9, 2024)
  - **Commit:** 9e641543cbe56853b736e48843d4e4204544316c
  - **Description:** Add feedback (contact) page.
- Fix Feedback Issues (June 10, 2024)
  - **Commit:** b8f9847d185d90e9bc852e77d3163d236a172c3c
  - **Description:** Fix wrong feedback email and some errors in contact view method.
- Enhance Feedback Functionality (June 11, 2024)
  - **Commit:** 8777958a400e483ea3eb64459e8023fb2b65ff7d
  - **Description:** Continue fix issues with send feedback.
- Refine User Feedback Experience (June 11, 2024)
  - **Commit:** 5f85e206baa8716f515217c18061498bbaffe237
  - **Description:** Change feedback text.


#### Sprint 6: Subscription Management and Payment Integration
**Duration:** 5 days (June 12, 2024 - June 16, 2024)

**Goals:**
- Implement subscription management.
- Integrate payment functionalities.

**User Stories:**
- As a Subscriber, I want to easily purchase a subscription to access additional features and word sets.
- As a Subscriber, I want to manage my subscription and payment details securely.

**Tasks:**
- Implement Subscription Creation (June 12, 2024)
  - **Commit:** 250d9fc50044a960662f671ce47ee6d162dee1b9
  - **Description:** Add 'create subscription' functionality.
- Integrate Stripe Payment (June 13, 2024)
  - **Commit:** c3eb6912fa26beb6c5a1cef7bbdb49b973323985
  - **Description:** Add subscriptions and Stripe functionality.
- Improve Subscription Templates (June 14, 2024)
  - **Commit:** dfa40b7da73e72290a02c2678e5fcbdf13787122
  - **Description:** Improve subscriptions templates.
- Fix Subscription Issues (June 15, 2024)
  - **Commit:** 6e00ed3fc3c8960ee35f3290faf011938ca4b7a0
  - **Description:** Fix issue with accounts URLs.
- Enhance Subscription Management (June 16, 2024)
  - **Commit:** 4279931f98b71dff4dd4f3b38113ee54de6b232b
  - **Description:** Implement manage subscription features.


#### Sprint 7: User Interface Enhancements
**Duration:** 4 days (June 17, 2024 - June 20, 2024)

**Goals:**
- Enhance the overall user interface.
- Improve the user experience across different devices.

**User Stories:**
- As a Subscriber or Guest, I want to see basic statistics for my current session to monitor my immediate learning outcomes.

**Tasks:**
- Improve Home Page Styles (June 17, 2024)
  - **Commit:** 91f70e99f844c5d89607ad747db1312ca253e6e5
  - **Description:** Improve home page styles.
- Enhance Profile Page (June 18, 2024)
  - **Commit:** 685a19d4bb3cf7e6dacaa6eb62abd632394b068c
  - **Description:** Finished with profile.
- Optimize for Mobile (June 19, 2024)
  - **Commit:** 3dd981018f949e150bd5ec7c01f334978932f287
  - **Description:** Remove duplicate submit new word set functionality.
- Refine Wordset Modal (June 20, 2024)
  - **Commit:** 79f23bfe9db83da01184f59368aa8c2ef338b5ae
  - **Description:** Add create wordsets modal window.


#### Sprint 8: Wordset Sharing and Collaboration
**Duration:** 4 days (June 21, 2024 - June 24, 2024)

**Goals:**
- Implement features for sharing wordsets.
- Enable collaboration on wordsets.

**User Stories:**
- As a Subscriber, I want to share my word sets with others to help them learn.
- As a Subscriber, I want to participate in the ranking of word sets to see how my contributions compare to those of other learners.

**Tasks:**
- Add Wordset Sharing (June 21, 2024)
  - **Commit:** b78eac662f2c308c656f45f938921e0820a810b3
  - **Description:** Big readme update.
- Implement Collaboration Features (June 22, 2024)
  - **Commit:** 1d1bb705af61b630804c6f8fca378c35fd7fd959
  - **Description:** Disabled start button if no wordset.
- Improve Collaboration UI (June 23, 2024)
  - **Commit:** 9b16ef3c749ef69c0d1ad1ccdd7f11223e8b6c30
  - **Description:** Return Quiz link to header menu.
- Enhance Collaboration Backend (June 24, 2024)
  - **Commit:** 44158322364ba007e85ad4ce6e6a4d3fc08b3857
  - **Description:** Add backend for rating.


#### Sprint 9: Security and Performance Improvements
**Duration:** 3 days (June 25, 2024 - June 27, 2024)

**Goals:**
- Enhance the security of the platform.
- Improve the overall performance.

**User Stories:**
- As an Admin, I want to remove inappropriate content or user accounts to maintain a safe and positive learning environment.

**Tasks:**
- Improve Security Settings (June 25, 2024)
  - **Commit:** 6baf2f8da139d87977537458da1f2cb7237708e6
  - **Description:** Fix content out of div in email_confirm template.
- Enhance Performance (June 26, 2024)
  - **Commit:** 4ac44dfd4d1b7b9572a91cee20965af2673d269f
  - **Description:** Add Facebook modal window.
- Final Security Tweaks (June 27, 2024)
  - **Commit:** 4bdeb1e8d7a5689ebc082bf95875da417e2c0858
  - **Description:** Fix email_backend setting.


#### Sprint 10: Final Testing and Deployment
**Duration:** 2 day (June 28-29, 2024)

**Goals:**
- Perform final testing to ensure all features work as expected.
- Deploy the application to the production environment.

**User Stories:**
- As an Admin, I want to ensure the platform is fully functional and ready for use by all users.

**Tasks:**
- Final Testing of All Features (June 28-29, 2024)
  - **Commit:** No specific commit; comprehensive testing.
  - **Description:** Test all features implemented in previous sprints to ensure they work seamlessly.
- Fix Any Last-Minute Bugs (June 28-29, 2024)
  - **Commits:**
    - f96b3f09c5b3aac81aeb89b1bb16caba4c180d0d - add Bugs section to readme
    - 25d20ffc895ff913d63abdf33677e0199b5a6cb8 - improve disposition of the some contents
    - 2985ea71bc318e36e796667a54d31111b35bb0ad - remove square brackets from sprint 1 description
    - b11f9d0522d8d279d126996a95043dd3b442a530 - add section about Agile and subitem Facebook Page Mockup in Features section
    - ea814c1022ee9a48e6170af5813c3f5230d45785 - finished with footer styles
    - 681a769e62d5e44fd8b83eb440259f2a7f90ffee - improve footer styles
    - 9a702c4acd21e4025f9469cdcfcfbcb047fe32f5 - improve margin-top for some pages
    - 4ba901de8b4b6716edbe2b126e241e832b5b5d16 - improve menu styles
    - 4279931f98b71dff4dd4f3b38113ee54de6b232b - implemented manage subscription features
  - **Description:** Address any bugs or issues found during final testing.
- Prepare for Deployment (June 28-29, 2024)
  - **Commits:**
    - c5a537ed34915b70a8f4dffe2d65c30b45b8555b - profile width
    - dc305ee5a758e9e79bf3379e8f0e352eaff1dd60add - docstrings to landing.js
    - 53e53a3b588da9bb2563a8a196157430d7a6b937 - move js code from landing.html to landing.js
    - eca9a8036c50684a35c70d8a8bdffab37db7042d - clean code and add docstrings to wordsets app files
  - **Description:** Prepare the application for deployment, ensuring all configurations are correct.
- Deploy to Production (June 28, 2024)
  - **Commits:** Final deployment commit.
    - 0af1e76a52f6d04adfb5acab8efbbc3d48415c2c - wrong ranger results in winners table
    - 6242e793778370bfc58da566ff019d37c129be42 - add docstrings to script.js
    - f1942070644a2daaf04f7c2028bdf75ffec28793 - add docstring and clean code for quizzes app
    - 540819a19f05dbee661444f88b917527eeab4307 - all interactive elements within the #settings-form are disabled while the spinner is active
    - 291996211852ff354a94a5d1f89e403eb365f2cd - moved js from quiz_settings.html to quiz_maker.js, fix problem with reset wordsets select after create new wordsets
  - **Description:** Deploy the application to the production environment.


Each sprint in this schedule is a focused development cycle that addresses specific components of the project, facilitating clear progression towards the project goals.

---

## UX/UI Design

The platform's design focuses on creating an immersive and enjoyable learning experience. The user interface (UI) is intuitive and easy to navigate, ensuring that users of all ages and technical abilities can use the platform effectively. Here are some key elements of the UX/UI design:

### Dark Decadence Style

The platform adopts a **dark decadence** style, characterized by rich, deep colors that create an elegant and sophisticated look. This style is not only visually appealing but also reduces eye strain, making it easier for users to spend more time learning.

### Color Palette

The platform uses a calming and professional color palette to create a conducive learning environment. Accent colors are used sparingly to highlight key actions and important information. The dark mode design is enhanced by:

- **Primary Background**: Deep charcoal and black tones to minimize screen glare and provide a luxurious feel.
  - Example: ![#000000](https://via.placeholder.com/15/000000/000000?text=+) `#000000`
  - Example: ![#272222](https://via.placeholder.com/15/272222/272222?text=+) `#272222`

- **Text Colors**: Soft whites and light grays for readability against the dark background.
  - Example: ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/FFFFFF?text=+) `#FFFFFF`
  - Example: ![#CCCCCC](https://via.placeholder.com/15/CCCCCC/CCCCCC?text=+) `#CCCCCC`

- **Accent Colors**: Golds, deep reds, rich purples, greenish tones, and bluish tones to draw attention to critical features without overwhelming the user.
  - Example: ![#FFD700](https://via.placeholder.com/15/FFD700/FFD700?text=+) `#FFD700`
  - Example: ![#7B518D](https://via.placeholder.com/15/7B518D/7B518D?text=+) `#7B518D`
  - Example: ![#A1385C](https://via.placeholder.com/15/A1385C/A1385C?text=+) `#A1385C`
  - Example: ![#4CAF50](https://via.placeholder.com/15/4CAF50/4CAF50?text=+) `#4CAF50`
  - Example: ![#00BCD4](https://via.placeholder.com/15/00BCD4/00BCD4?text=+) `#00BCD4`

### Typography

The platform uses clean and modern fonts that are easy to read on both desktop and mobile devices. Headings and key text elements are slightly larger and bolder to provide a clear visual hierarchy.

- **Primary Font**: 'Lato', sans-serif
  - Example: ![Lato](https://via.placeholder.com/200x50.png?text=Lato)
- **Accent Font**: 'Caveat', cursive
  - Example: ![Caveat](https://via.placeholder.com/200x50.png?text=Caveat)

### Key Design Elements

- **Responsive Layout**: The platform is designed to work seamlessly across various devices, including desktops, tablets, and smartphones. This ensures that users can access their word sets and quizzes on the go.
- **Consistent Navigation**: A consistent and intuitive navigation structure helps users easily find what they need. Key actions, such as starting a quiz, managing word sets, and viewing statistics, are prominently displayed and accessible with minimal clicks.
- **Visual Feedback**: Immediate visual feedback is provided for user actions, such as answering quiz questions, updating word sets, and managing subscriptions. This helps users understand the impact of their actions and provides a sense of progression.

### Visual Design Components

- **Color Scheme**: The platform uses a calming and professional color palette to create a conducive learning environment. Accent colors are used sparingly to highlight key actions and important information.
- **Typography**: Clear and readable fonts are used throughout the platform. Different font sizes and weights help to create a visual hierarchy, making it easier for users to scan and understand the content.
- **Icons and Imagery**: Relevant icons and images are used to enhance the user experience. For example, star icons are used to represent word set ratings, and illustrative images are included in quizzes to aid in word association.
  - Example of Star Rating: <img src="static/readme/images/star_rating_example.png">
- **Interactive Elements**: Buttons, sliders, and other interactive elements are designed to be easily clickable and responsive. Disabled states are visually distinct to indicate when actions are not available.
  - Example of Button: <img src="static/readme/images/button_example.png" width="90">
  - Example of Disabled Button: <img src="static/readme/images/button_disabled_example.png" width="90">

### User Flows

1. **Subscriber User Flow**:
   - **Profile**: Access to personalized word sets, and subscription details. View and manage subscription plans, payment detail.
   - **Quiz Maker**: Easy-to-use forms for creating and editing word sets.
   - **Quiz**: Selection of word sets, quiz settings, and immediate feedback on performance.

2. **Guest User Flow**:
   - **Home Page**: Quick access to preset and shared word sets.
   - **Start Quiz**: Immediate start of quizzes without the need for registration.
   - **Winners Results tab**: View basic statistics for the current session, encouraging further engagement.

3. **Admin User Flow**:
   - **Admin Dashboard**: Overview of platform activity, user management, and content control.
   - **Manage Word Sets**: Add, edit, approve, or remove any project entities.

### Accessibility Considerations

- **Keyboard Navigation**: The platform is fully navigable using a keyboard, ensuring accessibility for users with mobility impairments.
- **Screen Reader Support**: All interactive elements and important content are labeled appropriately to provide a seamless experience for users relying on screen readers.
- **Color Contrast**: High contrast ratios are used to ensure readability for users with visual impairments.

By prioritizing user needs and employing best practices in UX/UI design, we aim to create a platform that is not only effective in facilitating learning but also enjoyable to use.

---

## Testing

### Flake8 validation

- The project code has passed the Flake8 validation outcome.

<img src="static/readme/images/flake8_check_result.png" width="600" alt="Flake8 validation result">

### The W3C Markup Validator, and W3C CSS Validator, and JSHint Javascript Validator Services

- All of these services were used to validate pages of the project to ensure there were no syntax errors in the project.

-   [W3C Markup Validator](https://validator.w3.org/nu/) - [results link](https://validator.w3.org/nu/?doc=https%3A%2F%2Fpme-8f6d8d60e106.herokuapp.com%2F)

See the W3C Markup validation **Results** in the image below:

<img src="static/readme/images/w3c_markup_validator_result.png" width="600" alt="W3C Markup validation results">

-   [W3C CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input) - [results link](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fpme-8f6d8d60e106.herokuapp.com%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)

See the W3C CSS validation **Results** in the image below:

<img src="static/readme/images/w3c_css_validation_result.png" width="600" alt="W3C CSS validation results">

-   [JSHint JavaScript Validator](https://jshint.com/)

See the JSHint validation **Results** in the image below (it was inserting content of all my JS files into the JSHint validator):

<img src="static/readme/images/JSHint_validation_result.png" width="600" alt="JSHint validation results">


### Accessibility

1. I confirmed that the colors and fonts chosen are easy to read and accessible by running it through lighthouse in devtools.

- Lighthouse Chrome devtool test results:

<img src="static/readme/images/Lighthouse_Test_Result.png" width="700" alt="Lighthouse Chrome devtool test results">

2. I tested that this page works in different browsers: Chrome, Firefox, Mircrosoft Edge.

3. I confirmed that this project is responsive, looks good and functions on all standard screen sizes using the devtools device toolbar.

4. I have confirmed that the form works: requires entries in every field, will only accept an email in the email field, and the submit button works.


## Bugs

### 1. Incorrect Feedback Email

- **Description:** Users receive a confirmation email with an unspecified email address: your_email@example.com 

  <img src="static/readme/images/wrong_feedback_email.png" width="500" alt="Incorrect feedback email">

- **Solution:** Specify the project email in the view that generates this email message.

  <img src="static/readme/images/wrong_feedback_email_fix.png" width="500" alt="Corrected feedback email">

  ### 2. Unclosed Tag in Email Template

- **Description:** Forgot to close the allauth template tag.

  <img src="static/readme/images/unclosed_tag_in_email_template.png" width="500" alt="Unclosed tag in email template">

- **Solution:** Closed the allauth template tag.

 <img src="static/readme/images/unclosed_tag_in_email_template_fix.png" width="500" alt="Fixed unclosed tag in email template">

  ### 3. Cut Content in Home Page Divs

- **Description:** On small screens, content is cut off in the home page divs.

  <img src="static/readme/images/styles_error_crop_div_edge.png" width="500" alt="Cut content in home page divs">

- **Solution:** Add styles and media queries for the problematic divs.

 <img src="static/readme/images/styles_error_crop_div_edge_fix1.png" width="500" alt="Added styles and media queries to fix cut content">

 - **Result:** Correct display of home page divs.

 <img src="static/readme/images/styles_error_crop_div_edge_fix2.png" width="500" alt="Correct display of home page divs">

  ### 4. Absent Mailchimp Environment Variables in Heroku

- **Description:** An internal error occurs when attempting to subscribe.

  <img src="static/readme/images/newsletter_error.png" width="500" alt="Newsletter error">

- **Solution:** Add the correct Mailchimp environment variables in Heroku.

 <img src="static/readme/images/newsletter_error_fix1.png" width="500" alt="Fixed Mailchimp environment variables">


 - **Result:** Correct feedback from the Mailchimp server.

 <img src="static/readme/images/newsletter_error_fix2.png" width="500" alt="Correct feedback from Mailchimp server">

### 5. Error During Profile Template Rendering

- **Description:** When attempting to open the profile page, an error occurs: NoReverseMatch at /subscriptions/success/.

  <img src="static/readme/images/error_reverse_for_profile_is_not_a_valid_view_function.png" width="500" alt="Error during profile template rendering">

- **Solution:** Fix the view method and main URLs.

 <img src="static/readme/images/fix1_error_reverse_for_profile_is_not_a_valid_view_function.png" width="500" alt="Fixed view method and URLs">

 <img src="static/readme/images/fix2_error_reverse_for_profile_is_not_a_valid_view_function.png" width="500" alt="Corrected profile page rendering">

---

## Deployment

The deployment process for the platform involves setting up the application environment, configuring the database, and loading necessary fixtures to populate the initial data. Here are the steps to deploy the platform:

### Prerequisites

Ensure you have the following installed:
- Python 3.8+
- Django 3.2+
- PostgreSQL
- Heroku CLI (if deploying to Heroku)

### Environment Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/your-project.git
    cd your-project
    ```

2. **Create a Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows use `venv\Scripts\activate`
    ```

3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the necessary environment variables:
    ```
    DATABASE_URL:            postgres://{user}:{password}@{hostname}:{port}/{database-name}
    DEBUG:                   False
    DEFAULT_FROM_EMAIL:      project-from-email@gmail.com
    DISABLE_COLLECTSTATIC:   1
    EMAIL_BACKEND:           django.core.mail.backends.smtp.EmailBackend
    EMAIL_HOST_PASSWORD:     project-from-email@gmail.com google app api password
    EMAIL_HOST_USER:         project-from-email@gmail.com
    MAILCHIMP_API_KEY:       mailchimp_api_key
    MAILCHIMP_DATA_CENTER:   mailchimp_data_center_prefix
    MAILCHIMP_EMAIL_LIST_ID: mailchimp_email_list_id
    SECRET_KEY:              django_secret_key
    STRIPE_PRICE_ID:         stripe_price_id
    STRIPE_PUBLIC_KEY:       stripe_public_key
    STRIPE_SECRET_KEY:       stripe_secret_key
    STRIPE_WH_SECRET:        stripe_webhook_secret
    ```

### Database Configuration

1. **Run Migrations**:
    ```bash
    python manage.py migrate
    ```

2. **Load Fixtures**:
    To load initial data into the database, use the following commands:

    ```bash
    python manage.py loaddata wordsets/fixtures/wordsets_fixture.json
    python manage.py loaddata wordsets/fixtures/wordsets_and_word_fixture.json
    ```

### Running the Application

1. **Start the Development Server**:
    ```bash
    python manage.py runserver
    ```

2. **Create a Superuser**:
    ```bash
    python manage.py createsuperuser
    ```

### Deployment to Heroku

1. **Log in to Heroku**:
    ```bash
    heroku login
    ```

2. **Create a New Heroku App**:
    ```bash
    heroku create pme
    ```

3. **Set Heroku Environment Variables**:
    ```bash
    heroku config:set DEBUG=False
    heroku config:set SECRET_KEY=your_secret_key
    heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
    ... (see above full list)
    ```

4. **Add PostgreSQL Add-on**:
    ```bash
    heroku addons:create heroku-postgresql:hobby-dev
    ```

5. **Deploy to Heroku**:
    ```bash
    git push heroku main
    heroku run python manage.py migrate
    heroku run python manage.py loaddata wordsets/fixtures/wordsets_fixture.json
    heroku run python manage.py loaddata wordsets/fixtures/wordsets_and_word_fixture.json
    heroku run python manage.py createsuperuser
    ```

### Testing the Deployment

1. **Access the Application**:
    Open your browser and go to `https://your-app-name.herokuapp.com`.

2. **Log in to the Admin Panel**:
    Go to `https://your-app-name.herokuapp.com/admin` and log in using the superuser credentials created earlier.

3. **Verify Data**:
    Check that the initial data loaded correctly and that the application functions as expected.

4. **Stripe payments test data**:
    For testing Stripe payments through the subscription feature, use the following test card details:
    
    **Card Number: 4242 4242 4242 4242**

    This card number can be used to create successful test payments during development.

By following these steps, you will have your platform up and running with the necessary initial data loaded and ready for users.

---

## Acknowledgments

- **My sister** - Eleonora Rastvorova - who inspired me to create this project.
- **My family** - Darya, Veronika, and Elmira - who support and encourage me.
- **My Mentor** - Oluwafemi Medale - for continuous helpful feedback.
- **My Cohort Facilitator** - Marko Tot - for the timely and great advice.
- **Code Institute** - for my professional growth and the great opportunity to make something useful for people.

---

## License

- This project is licensed under the MIT License.


[Back to Table of Contents](#table-of-contents)
