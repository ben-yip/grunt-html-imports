# grunt-html-imports

> Import html partials.  
>
> Having trouble managing and modularizing your static HTML project?  
Try this plugin.

## How it works?

- Use a `<link>` tag to indicate which html-fragment you want to import. What this plugin do is to replace each import-link tag statement with the according file content.
- It does NOT matter whether you use relative or absolute paths. 
- You can even import recursively (eg. `b.html` imported to `a.html`, and `c.html` imported to `b.html`)

Just write the import-link tag, and get what you want.


### Example

Consider you have 3 following .html files:  

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Index</title>
</head>
<body>

<link rel="import" href="common/_header.html">

<p> Index page content </p>

<link rel="import" href="common/_footer.html">

</body>
</html>
```

**common/_header.html**
```html
<header>
    This is header.
</header>
```

**common/_footer.html**
```html
<footer>
    This is footer.
</footer>
```

After processed by this plugin, an `index.html` file is output as follows:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Index</title>
</head>
<body>

<header>
    This is header.
</header>

<p> Index page content </p>

<footer>
    This is footer.
</footer>

</body>
</html>
```


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-imports --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-imports');
```

## The "html_imports" task

### Overview
In your project's Gruntfile, add a section named `html_imports` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  html_imports: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
```

### Options

#### options.htmlOnly
Type: `Boolean`  
Default value: `true`

Whether to process html files only.  
Basically, this plugin is designed to process html files. 

#### options.outputUnderscore
Type: `Boolean`  
Default: `false`

Conventionally, we name partial files start with an underscore(_) and there's NO need to output to dist directory.
          

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  html_imports: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  html_imports: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.1.0 &nbsp; init release.