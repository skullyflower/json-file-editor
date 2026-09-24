# json-file-editor

An Electron application with Svelte and TypeScript

## I learned Svelte over the weekend and built this quick and dirty little json file editor.

<img width="1032" height="987" alt="Screenshot 2026-09-15 at 7 57 53 AM" src="https://github.com/user-attachments/assets/949f4feb-7d8b-4ed5-804c-89b000066d06" />

You select a json file or a directory where your json files are located.

When the file is opened, it iterates through the keys searching for editable values (string, number, boolean) or nested keys with string values to display as inputs for the form. It goes 4 levels deep and shows any further nested values as editable JSON strings.

The form will spell check and auto replace for strings.

You can add and delete values for Arrays, even if they are objects.

Then you can click Save to save the changes back to the json file, or Reset to start over, click on a different file to edit, or select a different directory and list of files.

TODO: DRY out the repeating nested structure of the main function. 

### Install
```bash
$ npm install
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
