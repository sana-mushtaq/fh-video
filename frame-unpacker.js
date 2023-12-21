const FrameUnpacker = (() => {
    // Function to unpack frames
    const unpack = async options => {
        // Destructuring options
        const { urlPattern, start, end, padding } = options;

        // Arrays to store bitmaps and fetch calls
        const bitmaps = [];
        const calls = [];

        // Performance measurement
        const timeStart = performance.now();

        // Download each frame image and prepare it
        for (let index = start; index <= end; index++) {
            // Format the frame number with leading zeros
            const id = index.toString().padStart(padding, '0');
            // Construct the URL using the provided pattern
            const url = urlPattern.replace('{{id}}', id);

            // Fetch and process the image
            calls.push(
                fetch(url).then(res =>
                    res.blob().then(blob =>
                        createImageBitmap(blob).then(bitmap => bitmaps.push({ id: index, bitmap }))
                    )
                )
            );
        }

        // Wait for all downloads to finish
        await Promise.all(calls);

        // Sort the downloaded frame bitmaps in order
        bitmaps.sort((a, b) => a.id - b.id);

        // Create an array of frames
        const frames = bitmaps.map(bitmap => bitmap.bitmap);

        // Calculate extraction time
        const timeDelta = performance.now() - timeStart;
        log(`Average extraction time per frame: ${timeDelta / (end - start)}ms`);

        return frames;
    };

    // Return the unpack function
    return {
        unpack
    };
})();
