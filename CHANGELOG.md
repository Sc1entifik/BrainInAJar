# Versions

- **v-0.0.1**
    - Initial Commit.
    - Added CHANGELOG.md
    - Made some styling rules.

- **v-0.1.0**
    - Added ChatForm.tsx to components.
    - Added Conversation.tsx to components.
    - Added conversation.tsx to routes which renders the Conversation JSX element in a partial and Chatform JSX element in a Partial so that the form resets on every submission despite being inside a partial.

- **v-0.1.5**
    - Moved brain.json to data folder
    - Added data folder to .gitignore
    - Created types folder to hold brain.ts
    - brain.ts exports Brain and UserBrains interfaces.

- **v-0.1.7**
    - Added fonts for logo and conversation.
    - Had ChatGPT make me an awesome logo of a brain smiling in a jar!
    - Converted logo to svg format.
    - Favicon is the same file as the logo.

- **v-0.2.0**
    - Added talkToABrain.tsx route to move the brain conversation page over to it's own route.
    - Added BrainInAJarLogo.tsx which renders the Logo and the project name.
    - Added MainMenuLinks.tsx that has the links to different parts of the page.
    - Added main menu landing page.
    - Added new routes to siteMap.ts
    - Added new files to fileMap.ts
    - General clean up and refactoring.

- **v-0.2.5**
    - Added createBrain.tsx route.
    - Added POST handler at createBrain.tsx route.
    - Added CreateBrainForm.tsx island.
    - data/brain.json now holds brains and can hold conversations.
    - Created brainFood folder in data folder which will hold all files that will be added to vector stores from the open ai api.
    - Added createBrainsFields enum to store all the fields for the CreateBrainForm island and the POST handler at createBrain.tsx.

- **v-0.2.7**
    - Added selectBrain.tsx route
    - Added BrainSelectionForm.tsx so users can click on and select brains.
    - Added brainSelectionFields.ts enum so the Post handler and the brain selection forms will by synced.
    - Added utils/server/getCookieValue.ts to get cookie values by passing in the cookie name and the cookie header.
