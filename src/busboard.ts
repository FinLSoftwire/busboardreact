export class busInfo{
    public stationName: string;
    public lineName: string;
    public destination: string;
    public timeToArrival: number;
    constructor(stationName:string, lineName: string, destination:string, timeToArrival:number){
        this.stationName = stationName;
        this.lineName = lineName;
        this.destination = destination;
        this.timeToArrival = timeToArrival;
    }
}

export class lineDisruptionInfo{
    public stationName: string;
    public fromDate: string;
    public toDate: string;
    public description: string;
    constructor(stationName: string, fromDate: string, toDate: string, description: string) {
        this.stationName = stationName;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.description = description;
    }
}

const outputBusStopArrivals = async(busStopID: string) => {
    try {
        const busArrivalsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/"+busStopID+"/Arrivals");
        const busArrivalsJSON = await busArrivalsResponse.json();
        if (busArrivalsResponse.status >= 300) {
            console.log("Bus stop with ID " + busStopID + " does not exist.");
        } else {
            return outputPredictedArrivalsFromJSON(busArrivalsJSON);
        }
    } catch (error) {
        console.error(error);
    }
}

const fetchPostcodeLongitudeLatitude = async(postCode: string): Promise<[number, number]> => {
    try {
        const postCodeResponse = await fetch("https://api.postcodes.io/postcodes/"+postCode);
        const receivedPostCodeJSON = await postCodeResponse.json();
        if (receivedPostCodeJSON.status >= 300) {
            console.error("Post code not found");
        } else {
            console.log(receivedPostCodeJSON.result);
            return [receivedPostCodeJSON.result.longitude, receivedPostCodeJSON.result.latitude];
        }
    } catch (error) {
        console.error(error);
    }
    return [0,0];
}

const fetchBusStopsByLongitudeLatitude = async(longitude: number, latitude: number) => {
    try {
        let nearbyStopResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat="+latitude+"&lon="+longitude+"&stopTypes=NaptanPublicBusCoachTram&radius=200");
        let nearbyStopJSON = await nearbyStopResponse.json();
        if (nearbyStopJSON.status >= 300) {
            console.log("Post code not found");
            return null;
        } else {
            if (nearbyStopJSON.stopPoints.length < 2)
                console.log("Only found " + nearbyStopJSON.stopPoints.length + " stops within 200 metres.");
            return nearbyStopJSON.stopPoints;
        }
    } catch (e) {
        console.error(e);
    }
}

async function getDisruptionsByID(stopPointID: number): Promise<lineDisruptionInfo[]> {
    let lineDisruptions: lineDisruptionInfo[] = [];
    try {
        let stationDisruptionsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/"+stopPointID+"/Disruption");
        let retrievedStationDisruptions = await stationDisruptionsResponse.json();
        if (retrievedStationDisruptions.status >= 300) {
            console.log("Failed to find disruptions for the given station");
            return [];
        } else {
            retrievedStationDisruptions.forEach(
                (retrievedDisruption: {stationAtcoCode: string, fromDate: string, toDate: string, description: string}) => {
                    lineDisruptions.push(new lineDisruptionInfo(
                        retrievedDisruption.stationAtcoCode, retrievedDisruption.fromDate,
                        retrievedDisruption.toDate, retrievedDisruption.description));
                }
            );
        }
    } catch (e) {
        console.error(e);
    }
    return lineDisruptions;
}

function outputPredictedArrivalsFromJSON(predictedArrivalsJSON: {stationName: string; lineName: string; towards: string; timeToStation: number}[]) {
    let chronologicalPredictedArrivalObjects = predictedArrivalsJSON.sort( (a,b) => {return a.timeToStation-b.timeToStation; });
    let predictedArrival =[];
    for(let arrivalObjectIndex in chronologicalPredictedArrivalObjects) {
        if (arrivalObjectIndex === "5")
            break;
        let currentArrivalObject = chronologicalPredictedArrivalObjects[arrivalObjectIndex];
        let arrivalInformation = new busInfo(
            currentArrivalObject.stationName,
            currentArrivalObject.lineName,
            currentArrivalObject.towards,
            currentArrivalObject.timeToStation);
        predictedArrival.push(arrivalInformation);
    }
    return predictedArrival;
}


export async function getBusPredictions (requestedBusStopPostCode: string){
    let busPredictions: busInfo[][] = [];
    const postCodeLongLat = await fetchPostcodeLongitudeLatitude(requestedBusStopPostCode);
    if (postCodeLongLat[0] === 0 && postCodeLongLat[1] === 0) {
        throw new Error("Invalid Postcode");
    }
    const nearbyStops = await fetchBusStopsByLongitudeLatitude(...postCodeLongLat);
    for (let stopIndex = 0; stopIndex < Math.min(2, nearbyStops.length); stopIndex++) {
        const foundArrivals = await outputBusStopArrivals(nearbyStops[stopIndex].id);
        if (typeof foundArrivals !== 'undefined')
            busPredictions.push(foundArrivals);
    }
    return busPredictions;
}