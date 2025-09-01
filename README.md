# json-file-editor

An Electron application with Svelte and TypeScript

## I learned Svelte over the weekend and built this quick and dirty little json file editor.

<img width="984" height="853" alt="image" src="https://github.com/user-attachments/assets/0df47fe4-4081-4579-ba07-4f41515267b9" />

You select the directory where your json files are located, and it will display the list of json files as buttons.
Clicking on a button will open the corresponding json file in the editor.

When the file is opened, it iterates through the keys searching for keys, and nested keys with string values to display as inputs for the form. I think it goes 3 levels deep.

The form does spell checking. Right click the misspelled word to see suggestions, clicking the suggestion will replace the misspelled word with the selected suggestion.

Then you can click Save to save the changes back to the json file, click on a different file to edit, select a different directory and list of files, or Reset to start over.

## It's a work in progress

- [ ] Improve the UI/UX - I just took the template's style and ran with it.
- [ ] Add any tests

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
