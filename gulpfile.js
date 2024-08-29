import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

export function js(done) {

    src('src/js/*.js')
        .pipe(dest('dist/js'));
    
    done();
}

export function css(done) { // done is a callback function that signals the completion of the task
   src('src/scss/*.scss', {sourcemaps: true})
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('dist/css' , {sourcemaps: true}));
done();
}

export function html(done) {
    src('*.html')
        .pipe(dest('dist'));
    done();
}

export function images(done) {
    src('src/img/**/*')
        .pipe(dest('dist/img'));
    done();
}

export function videos(done) {
    src('video/**/*')
        .pipe(dest('dist/video'));
    done();
}


export function dev(){
    watch('src/scss/**/*.scss', css);
    watch('src/js/*.js', js);    
}

export function build(done) {
    series(css, js, html, images, videos)(done);
}

export default series(build, dev); // This is the default task that will run when you run gulp in the terminal 



// pararel ejecuta todas las tareas al mismo tiempo
// export default parallel(css, js, dev); // This is the default task that will run when you run gulp in the terminal