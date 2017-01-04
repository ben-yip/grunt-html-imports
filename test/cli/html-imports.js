/**
 * Created by BenYip on 10/11/2016.
 *
 *  todo 待完善功能：
 *  - 对 <link rel="import"> 语句的正则搜索健壮性增强
 *  - 被包含的文件不存在时，要抓取访问错误，并在控制台给予提示
 *  - 支持递归遍历目录
 *  - 支持外部文件配置
 *  - 作为 NPM 包发布
 *  - 要正式成为 CLI 工具，可借助第三方库：https://github.com/tj/commander.js
 *      还有其他功能类似的库，参考：http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
 *
 * ========================
 * - v0.2
 * - 2016-11-15 21:04:16
 * ========================
 *  改变配置方式：参数可在命令行中传入：
 *      第一个参数为源目录，默认为 .\pagesrc
 *      第二个参数为输出目录，默认为 .\page
 *  应在项目根目录直接执行 node .\src\html-imports.js
 *  注意与执行目录的位置关系即可。
 *
 *  这样一来改参数就不用动源码了，以后会打造成正式的命令行工具。
 *
 * ========================
 * - v0.1
 * - 2016-10-12 15:39:59
 * ========================
 *  模拟 HTML Imports ：
 *      对出现 <link rel="import" href="fragment.html"> 的地方替换为对应的文件内容。
 *
 */

const fs = require('fs');
const path = require('path');


/**
 * todo
 *      配置可以考虑以外部 json 配置文件的形式加载
 *      不过要json文件不能写注释。
 */
var config = {
    //调试模式，输出额外构建信息
    debug: false

    //源文件目录
    , src: process.argv[2] || './tmp'

    //输出文件目录
    , dest: process.argv[3] || './out'

    // 需要重新构建填充内容的HTML文件
    // , files: [
    //     'all.html'
    // ]
};

/**
 * 创建目标文件存放的目录
 */
(function createDestDir() {
    fs.mkdir(config.dest, function (err) {
        if (err) {
            if (err.code === 'EEXIST') {
                if (config.debug) console.log('Destination directory exists, mkdir ignored.')
            } else {
                if (config.debug) {
                    console.log('Some Error occurred in fs.mkdir, Check it out:');
                    console.log(err);
                }
                throw err;
            }
        }
    });
})();

/**
 * 根据文件中的 <link rel="import" href="fragment.html">
 *     替换对应文件中的内容。
 *
 * @param src
 * @param dest
 * @param filename
 */
var importHtmlFrag = function (src, dest, filename) {

    console.log('--- ' + filename);

    // 读取母版 HTML 文件
    // https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback
    // fs.readFile(file[, options], callback)
    fs.readFile(path.join(src, filename), {
        encoding: 'utf-8'  // 需要指定编码方式，否则返回原生buffer
    }, function (err, data) {
        if (err) throw err;

        /**
         * 借助正则搜索使用了 <link rel="import" href="xxx"> 的地方
         * 备忘：
         *      首先是可能出现的前导空格
         *      <link rel="import" href="xxx">【允许属性间使用多个空格
         *      使用全局模式，忽略大小写
         *      href中的值使用捕获组获取
         *
         *   todo 这个正则需要再考虑一下健壮性
         */
        var linkImportRegex = / *<link\s*rel=["']import["']\s*href=["'](.*)["']>/gi;

        var replacedData = data.replace(linkImportRegex, function (matches, capture1) {

            var fragmentPath = capture1.trim();

            console.log('importing: ' + fragmentPath);

            // 正则中使用了捕获组，第一个捕获组就是 href 中的内容
            // 同步读取文件，并返回内容以替换
            return fs.readFileSync(path.join(src, fragmentPath), {encoding: 'utf8'});
        });


        /**
         * 生成合并后的文件到指定的目录
         *
         * 用这种方式判断文件是否可访问：
         *      https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback
         *
         * fs.open(path, flags[, mode], callback)
         *      flag 为 'w'，即以写方式打开，无论文件是否存在
         *      https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback
         */
        var destFilePath = dest + '/' + filename;
        fs.open(destFilePath, 'w', {encoding: 'utf8'}, function (err) {
            if (err) {
                console.log(err);
                if (err.code === 'ENOENT') {
                    console.log('目录或文件不存在'); //有可能是因为目标目录不存在
                }
            }

            // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
            // fs.writeFile(file, data[, options], callback)
            fs.writeFile(destFilePath, replacedData);
        });
    });
};


/**
 * 执行逻辑：
 *      源目录下的所有 html 文件均执行构建，下划线(_)开头的除外
 *      如果给出数组指定需要构建的 html 文件，则按照数组中的执行。
 *
 * todo [暂不支持递归遍历]
 */

var build = function () {
    if (!config.files) {
        //读取指定源文件目录下的所有文件（和目录）
        fs.readdir(config.src, 'utf8', function (err, files) {

            //过滤前
            // if (config.debug) {
            //     console.log('Before Filter: result of \'fs.readdir()\'');
            //     console.log(files);
            // }

            /*
             * todo
             *   应按照合理的逻辑执行默认的过滤，
             *   而且过滤可以通过配置定制
             */

            //把目录等排除，只保留文件 todo 要做遍历功能的话，这一步就不能要了
            files = files.filter(function (file) {
                return fs.statSync(path.join(config.src, file)).isFile();
            });
            // if (config.debug) {
            //     console.log('Filter out non-file type:');
            //     console.log(files);
            // }

            //把下划线开头的文件排除
            files = files.filter(function (file) {
                return file.indexOf('_') !== 0;
            });
            // if (config.debug) {
            //     console.log('Filter out files whose name starts with \'_\':');
            //     console.log(files);
            // }

            //只保留 .html 后缀的文件 todo 如果要支持其他后缀类型文件的话，这一步要去掉
            files = files.filter(function (file) {
                return path.extname(file) === '.html';
            });
            // if (config.debug) {
            //     console.log('Filter out non html files:');
            //     console.log(files);
            // }

            //过滤完毕，批量执行操作
            files.forEach(function (file) {
                importHtmlFrag(config.src, config.dest, file);
            });

        });
    } else {
        // 如果指定了文件列表，则只操作这些文件
        if (Array.isArray(config.files)) {
            config.files.forEach(function (file) {
                importHtmlFrag(config.src, config.dest, file);
            });
        }
    }
};

// 先执行一次
build();


/**
 *  监控整个源目录下的文件变动，若有变更后重新生成
 *
 *  todo
 *      [尚未加入递归监听功能]（watch方法提供的option中有recursive选项）
 *      [哪个改变了才重构哪个]（要理清依赖关系不容易，所以暂时只能粗暴地整个目录下的都操作一次，文件不多的情况下不用担心性能）
 */
// https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener
// fs.watch(filename[, options][, listener])
fs.watch(config.src, function (eventType, filename) {
    console.log(filename + ' changed, re-importing html fragments...');
    build();
});
console.log('Watching files...'); //todo 其实应该等第一次构造后才打印这句话的（构造过程为异步
