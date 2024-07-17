import gulp from 'gulp'
import newer from 'gulp-newer'
import browserSync from 'browser-sync'
import { PATHS } from '../config/paths.js'

export default function video() {
    return gulp
        .src(PATHS.src.videos)
        .pipe(newer(PATHS.dist.videos))
        .pipe(gulp.dest(PATHS.dist.videos))
        .pipe(browserSync.stream())
}
