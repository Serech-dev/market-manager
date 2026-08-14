CHANGELOG


v0.6.0

-implement color theme system
-create account menu dropdown containing theme and auth interactions
-change Frontend code to respect CSS color palettes from themes
-redesign headers for product list dashboard

v0.5.0

-implement Frontend controlled auth system
-implement Token authentication system
-remove unused/deprecated django modules
-clean up django settings 

v0.4.5

-add product manual creation
-add 0 sale product archiving
-add quantities to sales
-calculate price per unit on sales 
-fix product sorting by last sale bug


v0.4.0

-add product model and pages
-add product analytics
-add filtering by date on products
-add a product listing page with sorting and visual elements


v0.3.0

-configure and set up PWA support for mobile installation
-add custom date-range filtering
-add currency formatting
-add contextual period summaries


v0.2.1

-successfully deployed to Render (DB/Backend) and Vercel (Frontend)
-configured django settings for deploy
-configured react for deploy
-changed .env and variable handling on settings and api.js for deploy


v0.2.0

-update CSS based frontend to Tailwind
-design theme and scheme for frontend across the whole app
-add confirmation window to sale delete
-add popup flair to creation, errors and deletion requests
-add error specific warnings
-add main theme color palette to index


v0.1.5

-add filtering functionality by month and day
-add button to toggle filtering functionality by month and day


v0.1.4

-add full CRUD functionality for sales
-add new editing page and delete/edit button


v0.1.3

-add new sale button to dashboard
-add new "agregar venta" page 


v0.1.2

-add basic frontend functionality
-create basic frontend dashboard
-add filtering to summary endpoint


v0.1.1

-refactor codebase to use sales module and model instead of finances/transaction 


v0.1.0

-first version of app
-create transaction and category models
-create migrations to populate category model
-add endpoint for creating transactions with multiple choices for categories
-add endpoint to retrieve a basic summary of uploaded data