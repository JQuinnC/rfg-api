import { FaviconSettings, generateFaviconFiles, generateFaviconHtml } from '@realfavicongenerator/generate-favicon';
import { getNodeImageAdapter, loadAndConvertToSvg } from "@realfavicongenerator/image-adapter-node";

export async function generateFavicon(imageUrl, outputPath) {
  try {
    // Load and convert the image to SVG
    const masterPicture = await loadAndConvertToSvg(imageUrl, getNodeImageAdapter());

    // Configure favicon settings
    const settings = new FaviconSettings({
      masterPicture,
      dest: outputPath,
      iconsPath: '/',
      design: {
        ios: {},
        desktopBrowser: {},
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#ffffff',
          onConflict: 'override'
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor: '#ffffff',
          manifest: {
            name: 'App',
            display: 'standalone',
            orientation: 'portrait'
          }
        }
      }
    });

    // Generate the favicon files
    const result = await generateFaviconFiles(settings);
    
    // Generate the HTML
    const html = await generateFaviconHtml(settings);

    return {
      files: result,
      html: html
    };
  } catch (error) {
    throw error;
  }
} 