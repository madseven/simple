import gulp from 'gulp'
import webpack from 'webpack-stream'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import generateHash from '../uttils/generateHash.js'
import { PATHS } from '../config/paths.js'
import { isProduction } from '../uttils/isProduction.js'

const IS_PROD = isProduction()
const hash = generateHash()
const jsFileName = IS_PROD ? `app.${hash}.min.js` : 'app.js'

export default function scripts() {
    return gulp
        .src(PATHS.src.scripts)
        .pipe(
            plumber({
                errorHandler: notify.onError('Error: <%= error.message %>'),
            }),
        )
        .pipe(
            webpack({
                mode: 'development',
                output: {
                    filename: `app.js`,
                    libraryTarget: 'umd',
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                },
                            },
                        },
                    ],
                },
            }),
        )
        .pipe(rename(jsFileName))
        .pipe(gulp.dest(PATHS.dist.scripts))
        .pipe(browserSync.stream())
        .on('end', () => {
            const replaceName = IS_PROD ? jsFileName : 'app.js'

            gulp.src(PATHS.dist.html + '*.html')
                .pipe(replace('app.js', replaceName))
                .pipe(gulp.dest(PATHS.dist.html))
        })
}
