import { MongoClient } from "mongodb";
import proj4 from "proj4";

const UTM_44N = "+proj=utm +zone=44 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
const WGS_84 = "+proj=longlat +datum=WGS84 +no_defs";
const utmConverter = proj4(UTM_44N, WGS_84);

async function run() {
  console.log("Projected test point [409985.45, 3203378.28]:", utmConverter.forward([409985.45, 3203378.28]));
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const collection = db.collection(MONGODB_COLLECTION);
  
  const docs = await collection.find({}).toArray();
  console.log("Total docs:", docs.length);

  // Find District-Boundary and compute bounds
  const districtDoc = docs.find(d => (d.name || d.Layer || d.layer || "").toLowerCase().includes("district"));
  if (districtDoc) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const processCoords = (coords) => {
      if (!Array.isArray(coords)) return;
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        const [lng, lat] = utmConverter.forward([coords[0], coords[1]]);
        if (lng < minX) minX = lng;
        if (lng > maxX) maxX = lng;
        if (lat < minY) minY = lat;
        if (lat > maxY) maxY = lat;
      } else {
        coords.forEach(processCoords);
      }
    };
    
    if (Array.isArray(districtDoc.features)) {
      districtDoc.features.forEach(f => processCoords(f.geometry?.coordinates));
    } else if (districtDoc.geometry) {
      processCoords(districtDoc.geometry.coordinates);
    }
    
    console.log(`District Bounds (WGS84):`);
    console.log(`  Min Lng: ${minX}, Max Lng: ${maxX}`);
    console.log(`  Min Lat: ${minY}, Max Lat: ${maxY}`);
    console.log(`  Center Lng: ${(minX + maxX) / 2}, Center Lat: ${(minY + maxY) / 2}`);
  }
  
  docs.forEach((doc) => {
    const layerName = doc.name || doc.Layer || doc.layer || "Unassigned";
    let featureCount = 0;
    let sampleGeom = null;
    let sampleProps = null;
    
    if (Array.isArray(doc.features)) {
      featureCount = doc.features.length;
      if (featureCount > 0) {
        sampleGeom = doc.features[0].geometry?.type;
        sampleProps = doc.features[0].properties;
        const coords = doc.features[0].geometry?.coordinates;
        console.log(`   Raw Coordinates Sample (Feature array):`, JSON.stringify(coords ? (Array.isArray(coords[0]) ? (Array.isArray(coords[0][0]) ? coords[0][0].slice(0, 3) : coords[0].slice(0, 3)) : coords) : "none"));
      }
    } else if (doc.geometry) {
      featureCount = 1;
      sampleGeom = doc.geometry.type;
      sampleProps = doc.properties || doc;
      const coords = doc.geometry.coordinates;
      console.log(`   Raw Coordinates Sample (Single geom):`, JSON.stringify(coords ? (Array.isArray(coords[0]) ? coords[0].slice(0, 3) : coords) : "none"));
    }
    
    console.log(`Layer: "${layerName}" | count: ${featureCount} | type: ${sampleGeom} | hasFeatures: ${Array.isArray(doc.features)}`);
    if (sampleProps) {
      console.log(`   Sample Properties: ${JSON.stringify(Object.keys(sampleProps))}`);
    }
  });
  
  await client.close();
}
run();
