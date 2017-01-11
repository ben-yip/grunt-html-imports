# grunt-html-imports

> Having trouble managing and modularizing your static HTML project?  
  Try this plugin.

## How it works?

- Use a `<link>` tag to indicate which html-fragment file you want to import.
- The syntax is the same as [HTML Imports in Working Draft](https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports).
- What this plugin do is to replace each import-link tag statement with the according file content.
- It does NOT matter whether you use relative or absolute paths.
- You can even import recursively (eg. `b.html` imported to `a.html`, and `c.html` imported to `b.html`)
- Just write the import-link tag, and get what you want. Check out the example below.
- For more solutions' comparison details and why this plugin is created, check out [solutions.zh-Hans.md](solutions.zh-Hans.md)  
  （关于编写本插件的来由和各种解决方案的对比分析，查看本仓库中的另一篇文章：[solutions.zh-Hans.md](solutions.zh-Hans.md)）

### Example

Consider you have 3 HTML files as follows:

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

Whether to process HTML files only.  
Note that this plugin is basically designed to process HTML files.

#### options.outputUnderscore
Type: `Boolean`  
Default: `false`

Conventionally, we name partial files start with an underscore(_) and there's NO need to output them to dist directory.
          

### Usage Example(s)

Basically, all you need to do is to specify `src` and `dest` dir.  
It's recommended to use `expand:true` and `cwd` property as well.

```js
grunt.initConfig({
  html_imports: {
    all: {
        expand: true,
        cwd: 'source/',
        src: 'page/**/*',
        dest: 'tmp/'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.1.0 &nbsp; init release.