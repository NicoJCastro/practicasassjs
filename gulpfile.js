import path from 'path';
import fs from 'fs';
import {glob} from 'glob';
import { src, dest, watch, series } from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

import terser from 'gulp-terser';
import sharp from 'sharp';

export function js(done) {
    src('src/js/*.js')
        .pipe(terser())
        .pipe(dest('dist/js'));

    done();
}

export function css(done) { // done is a callback function that signals the completion of the task
    src('src/scss/*.scss', { sourcemaps: true })
        .pipe(sass(
            { outputStyle: 'compressed' }
        ).on('error', sass.logError))
        .pipe(dest('dist/css', { sourcemaps: true }));


    done();
}

export async function crop(done) { 
    // Define las carpetas de entrada y salida, así como el tamaño de las miniaturas
    const inputFolder = 'src/img/gallery/full';
    const outputFolder = 'src/img/gallery/thumbs';

    // Define el tamaño de las miniaturas
    const width = 200;
    const height = 180;

    // Verifica si la carpeta de salida existe y, si no, la crea
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Lee los archivos de la carpeta de entrada y filtra solo los archivos con extensión .jpg
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        // Procesa cada archivo de imagen
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file);
            const outputFile = path.join(outputFolder, file);

            // Redimensiona la imagen y la guarda en la carpeta de salida
            sharp(inputFile)
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile);
        });
        done();
    } catch (error) {
        console.log(error);
    }

}

// Imagenes webp

// This function is responsible for processing and converting images to JPEG and WebP formats.
// It takes an array of image file paths as input and processes each image.
// The processed images are saved in the specified output directory.
// The function uses the sharp library for image processing.

export async function imagenes(done) {
    const srcDir = './src/img'; // Source directory where the original images are located
    const buildDir = './dist/img'; // Output directory where the processed images will be saved

    // Find all image files in the source directory
    const images = await glob('./src/img/**/*{jpg,png}')

    // Process each image
    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });

    done(); // Signal that the image processing is complete
}

// This function processes an individual image file.
// It creates the output directory if it doesn't exist and saves the processed images in it.
// The processed images include a JPEG version and a WebP version.

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true }) // Create the output directory if it doesn't exist
    }

    const baseName = path.basename(file, path.extname(file)) // Get the base name of the image file
    const extName = path.extname(file) // Get the file extension
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`) // Output file path for the JPEG version
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`) // Output file path for the WebP version
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`) // Output file path for the WebP version


    const options = { quality: 80 } // Image processing options (e.g., quality)
    
    // Convert the image to JPEG format and save it
    sharp(file).jpeg(options).toFile(outputFile)
    
    // Convert the image to WebP format and save it
    sharp(file).webp(options).toFile(outputFileWebp)

    // Convert the image to avif format and save it
    sharp(file).avif().toFile(outputFileAvif)
}

export function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/*.js', js);
    watch('src/img/*.{png, jpg}', imagenes);

}

export default series(crop, css, js, imagenes, dev); // This is the default task that will run when you run gulp in the terminal 

// pararel ejecuta todas las tareas al mismo tiempo
// export default parallel(css, js, dev); // This is the default task that will run when you run gulp in the terminal