# json-file-editor

An Electron application with Svelte and TypeScript

## I learned Svelte over the weekend and built this quick and dirty little json file editor.

<img width="952" height="729" alt="image" src="https://github.com/user-attachments/assets/83424b2d-accf-4887-a1e2-1da1ae28ee9a" />

You select a json file or a directory where your json files are located.

When the file is opened, it iterates through the keys searching for keys, and nested keys with string values to display as inputs for the form. I think it goes 3 levels deep.

The form does spell checking. You can add and delete values for Arrays. 

Then you can click Save to save the changes back to the json file, click on a different file to edit, select a different directory and list of files, or Reset to start over.

## It's a work in progress

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
