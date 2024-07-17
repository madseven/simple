import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import groupCssMediaQueries from 'gulp-group-css-media-queries'
import cssmin from 'gulp-cssmin'
import browserSync from 'browser-sync'
import generateHash from '../uttils/generateHash.js'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import sassGlob from 'gulp-sass-glob'
import gulpIf from 'gulp-if'
import gulpCleanCss from 'gulp-clean-css'
import { PATHS } from '../config/PATHS.js'
import { isProduction } from '../uttils/isProduction.js'

const IS_PROD = isProduction()
const sass = gulpSass(dartSass)
const hash = generateHash()
const styleFilename = IS_PROD ? `style.${hash}.min.css` : 'style.css'

export default function styles() {
    return gulp
        .src(PATHS.src.styles)
        .pipe(sassGlob())
        .pipe(
            sass({
                outputStyle: 'expanded',
            }).on('error', sass.logError),
        )
        .pipe(groupCssMediaQueries())
        .pipe(
            autoprefixer({
                cascade: true,
                grid: true,
                overrideBrowserslist: ['last 5 versions'],
            }),
        )
        .pipe(gulpIf(IS_PROD, gulpCleanCss()))
        .pipe(rename(styleFilename))
        .pipe(gulp.dest(PATHS.dist.styles))
        .pipe(browserSync.stream())
        .on('end', () => {
            const replaceName = IS_PROD ? styleFilename : 'style.css'

            gulp.src(PATHS.dist.html + '*.html')
                .pipe(replace('style.css', replaceName))
                .pipe(gulp.dest(PATHS.dist.html))
        })
}