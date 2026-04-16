# Changelog - CRM & AI Assistant Modifications

All notable changes to this project will be documented in this file.

## [2026-04-15]

### CRM Module
- **Interface Cleanup**: Decluttered the CRM filter bar by removing redundant labels and using a more modern, icon-driven layout with a subtle background and rounded-2xl styling.
- **Activity Log Refinement**: Streamlined the activity log header and filters with a cleaner button-pill design and consistent spacing.
- **Terminology Unification**: Removed all instances of "Log Call" in favor of "Log Entry" across the entire CRM interface, including table row actions and the global AI quick action bar.
- **Log Interaction Modal**: Replaced the 3x3 grid of buttons for selecting entry types with a clean `<select>` dropdown menu.
- **Log Entry Logic**: Updated `selectLogType` JavaScript function to handle the new dropdown input and maintain correct visibility toggles for internal source options.


### AI Assistant Module
- **Global Integration**: Entirely replaced the global "Unified Bar" (top search area) with the "Message ACHII Assistant" chat bar.
- **Refinement**: Removed the redundant "Quick Action" buttons from the AI bar to keep the interface focused purely on assistant interaction. Quick actions remain accessible via their respective module headers.
- **Redesign**: Removed redundant chat inputs from within the AI module to maintain a clean, single-point-of-entry design.

- **Branding**: Updated all placeholders and references to "ACHII Assistant".
### Core Architecture
- **Full Modularization**: Finalized the transition from a monolithic `index.html` to a modular structure using external `script.js` and `style.css` files.
- **Code Cleanup**: Removed over 600 lines of redundant and fragmented internal JavaScript from `index.html`.
- **Bug Fix**: Fixed a corrupted `<input>` tag in the "Record Payment" modal identified during the cleanup process.
- **Performance**: Improved page load and maintainability by utilizing external asset caching and reducing HTML file size.
