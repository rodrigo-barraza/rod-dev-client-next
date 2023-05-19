import moment from 'moment'
import EventLibrary from './EventLibrary';

const useS3: boolean = true;

const UtilityLibrary = {
    capitalize(string: string) {
        if (string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        }
    },
    toHumanDateAndTime(date: string) {
        if (date) {
            // return moment(date).format('MMMM Do, YYYY @ h:mmA')
            return moment(date).format('MMMM Do, YYYY')
        }
    },
    renderAssetPath(assetPath: string, collectionPath: string | undefined): string {
        let path = `/`;
        if (assetPath && !collectionPath) {
            path =`/${assetPath}`;
        } else if (!assetPath && collectionPath) {
            path = `/collections/${collectionPath}`;
        } else if (assetPath && collectionPath) {
            path = `/collections/${collectionPath}/${assetPath}`;
        }
        let fullPath: string = '';
        if (useS3) {
            fullPath = `https://assets.rod.dev${path}`
        }
        return fullPath;
    },
    imageFullScreen(event: Event & {target: Element}, collectionPath: object, workImagePath: object) {
        event.target.requestFullscreen();
        EventLibrary.postEventImageFullscreen(`/${collectionPath}/${workImagePath}`);
    },
    humanDuration(durationInSeconds: number | undefined): string {
        var minutes = moment.duration(durationInSeconds, 'seconds').minutes();
        var seconds = moment.duration(durationInSeconds, 'seconds').seconds();
        var humanDurationString = '';
        if (seconds && !minutes) {
            humanDurationString = `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        } else if (minutes && !seconds) {
            humanDurationString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
        } else if (minutes && seconds) {
            humanDurationString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
        }
        return humanDurationString;
    },
    playVideoOnMouseOver(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        const target = event.target as HTMLElement;
        const video = target.querySelector('video')
        if (video) {
            video.play();
        }
    },
    stopVideoOnMouseOver(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        const target = event.target as HTMLElement;
        const video = target.querySelector('video')
        if (video) {
            video.load();
        }
    }
    // generateCollectionsSchema() {
    //     console.log('home schema');
    // },
    // generateAboutSchema() {
    //     const imageObject = {
    //         "@context": "https://schema.org/",
    //         "@type": "ImageObject",
    //         "contentUrl": UtilityLibrary.renderAssetPath('images/rodrigo-barraza-black-and-white-portrait.jpg'),
    //         "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    //         // "acquireLicensePage": "https://example.com/how-to-use-my-images"
    //     }
    //     const postalAddressObject = {
    //         "@context": "https://schema.org/",
    //         "@type": "PostalAddress",
    //         "addressLocality": "Vancouver",
    //         "addressRegion": "British Columbia",
    //         "addressCountry": "Canada"
    //     }
    //     const personObject = {
    //         "@context": "https://schema.org",
    //         "@id": `https://rod.dev/about-rodrigo`,
    //         "@type": "Person",
    //         "image": imageObject,
    //         "givenName": "Rodrigo",
    //         "familyName": "Barraza",
    //         "description": "Photographer, software engineer and artist based out of Vancouver, British Columbia, Canada.",
    //         "jobTitle": "photographer, software engineer, artist",
    //         "address:": postalAddressObject,
    //     }

    //     AboutCollection.forEach((about) => {
    //         if (about.name === 'institutions') {
    //             const collageOrUniversityObject = {
    //                 "@context": "https://schema.org",
    //                 "@type": "CollegeOrUniversity",
    //                 "name": "Emily Carr University of Art + Design",
    //             }
    //             personObject.alumniOf = collageOrUniversityObject;
    //         }
    //     })
        
    //     const script = document.createElement('script');
    //     script.setAttribute('type', 'application/ld+json');
    //     script.textContent = JSON.stringify(personObject);
    //     document.head.appendChild(script);
    // },
    // generateCollectionSchema(collection) {
    //     const works = collection.works;
    //     const schemaArray = [];

    //     const collectionObject = {
    //         "@context": "https://schema.org",
    //         "@id": `https://rod.dev/collections/${collection.path}`,
    //         "@type": "Collection",
    //         "name": collection.title,
    //         "creator": "Rodrigo Barraza",
    //         "hasPart": []
    //     }

    //     works.forEach((work) => {
    //         if (work.imagePath) {
    //             const imageObject = {
    //                 "@context": "https://schema.org/",
    //                 "@type": "ImageObject",
    //                 "contentUrl": UtilityLibrary.renderAssetPath(work.imagePath, collection.path),
    //                 "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    //                 // "acquireLicensePage": "https://example.com/how-to-use-my-images"
    //             }
    //             const creativeWorkObject = {
    //                 "@context": "https://schema.org/",
    //                 "@type": "CreativeWork",
    //                 "name": work.title,
    //                 "author": "Rodrigo Barraza",
    //                 "image": imageObject,
    //                 // "@id": "http://www.worldcat.org/oclc/17105155",
    //                 // "isPartOf": {
    //                 //     "@id": "http://example.org/colls/68"
    //                 // },
    //             }
    //             schemaArray.push(creativeWorkObject);
    //         } else if (work.videoPath) {
    //             const videoObject = {
    //                 "@context": "https://schema.org",
    //                 "@type": "VideoObject",
    //                 "name": work.title,
    //                 "description": work.description,
    //                 "thumbnailUrl": UtilityLibrary.renderAssetPath(work.poster, collection.path),
    //                 "uploadDate": work.uploadDate,
    //                 "duration": moment.duration(work.duration, 'seconds').toISOString(),
    //                 "contentUrl": UtilityLibrary.renderAssetPath(work.videoPath, collection.path),
    //                 // "embedUrl": "https://www.example.com/embed/123",
    //                 // "interactionStatistic": {
    //                 //     "@type": "InteractionCounter",
    //                 //     "interactionType": { "@type": "WatchAction" },
    //                 //     "userInteractionCount": 5647018
    //                 // }
    //             }
    //             const creativeWorkObject = {
    //                 "@context": "https://schema.org/",
    //                 "@type": "CreativeWork",
    //                 "name": work.title,
    //                 "author": "Rodrigo Barraza",
    //                 "video": videoObject,
    //                 // "@id": "http://www.worldcat.org/oclc/17105155",
    //                 // "isPartOf": {
    //                 //     "@id": "http://example.org/colls/68"
    //                 // },
    //                 dateCreated: work.uploadDate,
    //                 abstract: work.description,
    //             }
    //             schemaArray.push(creativeWorkObject);
    //         }
    //     });
    //     collectionObject.hasPart = schemaArray;
    //     const script = document.createElement('script');
    //     script.setAttribute('type', 'application/ld+json');
    //     script.textContent = JSON.stringify(collectionObject);
    //     document.head.appendChild(script);
    // },
    // generateSitemap() {
    //     const routes = ViewsCollection;
    //     const collections = ArtCollectionsCollection;
    //     const doc = document.implementation.createDocument('', '', null);
        
    //     const urlsetElement = doc.createElement("urlset");
    //     urlsetElement.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
    //     urlsetElement.setAttribute("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1");
    //     urlsetElement.setAttribute("xmlns:video", "http://www.google.com/schemas/sitemap-video/1.1");

    //     routes.forEach((route) => {
    //         const urlElement = doc.createElement("url");
    //         const locElement = doc.createElement('loc');
    //         const lastmodElement = doc.createElement('lastmod');
    //         const changefreqElement = doc.createElement('changefreq');

    //         locElement.innerHTML =  `https://rod.dev${route.path}`;
    //         lastmodElement.innerHTML = '2022-10-07';
    //         changefreqElement.innerHTML = 'daily';

    //         urlElement.appendChild(locElement);
    //         urlElement.appendChild(lastmodElement);
    //         urlElement.appendChild(changefreqElement);

    //         if (route.images?.length) {
    //             route.images.forEach((image) => {
    //                 const imageImageElement = doc.createElement('image:image');
    //                 const imageLocElement = doc.createElement("image:loc"); 
    //                 const imageTitleElement = doc.createElement("image:title");
    //                 const imageCaptionElement = doc.createElement("image:caption");
    //                 const imageGeoLocationElement = doc.createElement("image:geo_location");
    //                 const imageLicenseElement = doc.createElement("image:license");

    //                 imageLocElement.innerHTML = this.renderAssetPath(`images/${image.path}`);
    //                 imageTitleElement.innerHTML = image.title;
    //                 imageCaptionElement.innerHTML = image.caption;
    //                 imageGeoLocationElement.innerHTML = image.geoLocation || 'Vancouver, Canada';
    //                 imageLicenseElement.innerHTML = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

    //                 urlElement.appendChild(imageImageElement);
    //                 imageImageElement.appendChild(imageLocElement); 
    //                 imageImageElement.appendChild(imageTitleElement);
    //                 imageImageElement.appendChild(imageCaptionElement);
    //                 imageImageElement.appendChild(imageGeoLocationElement);
    //                 imageImageElement.appendChild(imageLicenseElement);
    //             })
    //         }

    //         urlsetElement.appendChild(urlElement);

    //     })
        
    //     collections.forEach((collection) => {
    //         const urlElement = doc.createElement("url");
    //         const locElement = doc.createElement('loc');
    //         const lastmodElement = doc.createElement('lastmod');
    //         const changefreqElement = doc.createElement('changefreq');

    //         locElement.innerHTML =  `https://rod.dev/collections/${collection.path}`;
    //         lastmodElement.innerHTML = '2022-10-05';
    //         changefreqElement.innerHTML = 'daily';

    //         urlElement.appendChild(locElement);
    //         urlElement.appendChild(lastmodElement);
    //         urlElement.appendChild(changefreqElement);

    //         collection.works.forEach((work) => {
    //             if (work.imagePath) {
    //                 const imageImageElement = doc.createElement('image:image');
    //                 const imageLocElement = doc.createElement("image:loc"); 
    //                 const imageTitleElement = doc.createElement("image:title");
    //                 const imageCaptionElement = doc.createElement("image:caption");
    //                 const imageGeoLocationElement = doc.createElement("image:geo_location");
    //                 const imageLicenseElement = doc.createElement("image:license");

    //                 imageLocElement.innerHTML = this.renderAssetPath(work.imagePath, collection.path);
    //                 imageTitleElement.innerHTML = work.title;
    //                 imageCaptionElement.innerHTML = work.caption;
    //                 imageGeoLocationElement.innerHTML = work.location || 'Vancouver, Canada';
    //                 imageLicenseElement.innerHTML = 'https://creativecommons.org/licenses/by-nc-nd/4.0/';

    //                 urlElement.appendChild(imageImageElement);
    //                 imageImageElement.appendChild(imageLocElement); 
    //                 imageImageElement.appendChild(imageTitleElement);
    //                 imageImageElement.appendChild(imageCaptionElement);
    //                 imageImageElement.appendChild(imageGeoLocationElement);
    //                 imageImageElement.appendChild(imageLicenseElement);
    //             } else if (work.videoPath) {
    //                 const videoVideoElement = doc.createElement('video:video');
    //                 const videoContentLocElement = doc.createElement("video:content_loc"); 
    //                 const videoThumbnailLocElement = doc.createElement("video:thumbnail_loc"); 
    //                 const videoGalleryLocElement = doc.createElement("video:gallery_loc"); 
    //                 const videoTitleElement = doc.createElement("video:title");
    //                 const videoDescriptionElement = doc.createElement("video:description");
    //                 const videoDurationElement = doc.createElement("video:duration");
    //                 const videoPublicationDateElement = doc.createElement("video:publication_date");
    //                 const videoCategoryElement = doc.createElement("video:category");
    //                 const videoFamilyFriendlyElement = doc.createElement("video:family_friendly");

    //                 videoContentLocElement.innerHTML = this.renderAssetPath(work.videoPath, collection.path);
    //                 videoThumbnailLocElement.innerHTML = this.renderAssetPath(work.poster, collection.path);
    //                 videoGalleryLocElement.innerHTML = `https://rod.dev/collections/${collection.path}`;
    //                 videoTitleElement.innerHTML = work.title;
    //                 videoDescriptionElement.innerHTML = work.description;
    //                 videoDurationElement.innerHTML = work.duration;
    //                 videoPublicationDateElement.innerHTML = work.uploadDate;
    //                 videoCategoryElement.innerHTML = collection.type;
    //                 videoFamilyFriendlyElement.innerHTML = 'Yes';

    //                 urlElement.appendChild(videoVideoElement);
    //                 videoVideoElement.appendChild(videoContentLocElement);
    //                 videoVideoElement.appendChild(videoThumbnailLocElement);
    //                 videoVideoElement.appendChild(videoGalleryLocElement);
    //                 videoVideoElement.appendChild(videoTitleElement);
    //                 videoVideoElement.appendChild(videoDescriptionElement);
    //                 videoVideoElement.appendChild(videoDurationElement);
    //                 videoVideoElement.appendChild(videoPublicationDateElement);
    //                 videoVideoElement.appendChild(videoCategoryElement);
    //                 videoVideoElement.appendChild(videoFamilyFriendlyElement);
    //             }
    //         })
            
    //         urlsetElement.appendChild(urlElement);
    //     })
        
    //     doc.appendChild(urlsetElement);
    //     console.log(doc);

    //     const oSerializer = new XMLSerializer();
    //     const xmltext = oSerializer.serializeToString(doc);
    //     console.log(xmltext);
    // },
};

export default UtilityLibrary;