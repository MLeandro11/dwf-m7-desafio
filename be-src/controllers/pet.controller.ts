import {index} from '../lib/algolia'


export async function lostPets(query) {
    const {lat, lng} = query;
    const {hits} = await index.search("", {
        aroundLatLng: [lat,lng].join(','),
        aroundRadius: 5000,
        attributesToHighlight: []

    })
    return hits
}

