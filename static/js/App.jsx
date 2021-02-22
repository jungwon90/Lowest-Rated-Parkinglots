console.log('Hi, React is working!')

function App() {
    console.log('App is rendering');
    return(
        <Home />
    );
}

function Home(props){
    console.log('Home is rendering');
    const [data, setData] = React.useState([]);
    const [count, setCount] = React.useState(0);
 

    return (
        <div className="whole-container">
            <div id="search-bar-container">
                <label id="search-bar-label">Lowest Rated Parking Lots</label>
                <SearchBar data={data} setData={setData} count={count} setCount={setCount} />
            </div>
            <div id="main-container">
                <div id="list-container">
                    <ListContainer data={data}/> 
                </div>
                <div id="map-div-container">
                    <MapContainer data={data} count={count}/>
                </div>
            </div>
        </div>
    );
}

function SearchBar(props){
    console.log('SearchBar is rendering');
    const [isError, setIsError] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    let curCount = props.count;
    console.log(isError, searchInput, curCount);

    const handleSubmit = async event =>{
        event.preventDefault();
        curCount += 1;
        props.setCount(curCount);
        //get the values from the form
        const formInput = {
            'search-input': searchInput
        };

        if(searchInput === ''){
            alert('Please type the location');
        }else{
            //get request to /search route in the server
            $.get('/search', formInput, (res)=>{
                console.log(res);
                props.setData(res);

            }).fail(() => {
                setIsError(true);
                alert('unable to retrieve the data');
            });
        }

        
    };
    
    return (
        <div id="search-bar">
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e)=>{
                    e.preventDefault();
                    setSearchInput(e.target.value);
                }} name="search-input" id="search-input" placeholder="What location do you want to search?"></input>
                <input type="submit" value="search" id="search-btn"></input>
            </form>
        </div>
    );
}

function ParkingLot(props){
    //score = ( number of reviews * rating ) / (number of reviews + 1) 
    let score = (props.reviewCount * props.rating) / (props.reviewCount + 1);
    let rating_img = `/static/img/${props.rating}stars.png`;

    return(
        <div className="parking-lot">
            <div className="parking-lot-img">
                <img src={props.img_url} className="list-img" alt="parkinglot"></img>
                <img className="rating-img" src={rating_img}></img>
            </div>
            <div className="parking-lot-list-info">
                <p><b>{props.name}</b></p>
                <p>{props.addStr}</p>
                <p>Review Count: {props.reviewCount}</p>
                <p>Score: {score}</p>
                <a href={props.yelpURL}>View More Info in Yelp</a>
            </div>
        </div>
    );
}

function ListContainer(props){
    console.log('ListContainer is rendering');
    const listData = props.data;
    const parkingLotList = [];

    if(listData.length !== 0){
        console.log('after if statement');
        for(let i = 0; i < listData.length; i++){
            let addArr = [];
            let address = listData[i]['location']['display_address'];
            console.log(address);
            for(const el of address){
                addArr.push(el);
            }
            let addStr = addArr.join(', ');
            console.log(addStr);
            
            parkingLotList.push(<ParkingLot 
                key={i}
                img_url={listData[i]['image_url']}
                name={listData[i]['name']}
                addStr={addStr}
                rating={listData[i]['rating']}
                reviewCount={listData[i]['review_count']}
                yelpURL={listData[i]['url']}
            />);
        }
        console.log('list container after for loop');
    }

    return(
        <div className="list-scrollbar">
            {parkingLotList}
        </div>
    )
}

function MapComponent(props){
    console.log('MapComponent is rendering');
    const options = props.options;
    const ref = React.useRef(); //creating Ref object

    React.useEffect(()=>{
        //map creating function
        const createMap = () => props.setMap(new window.google.maps.Map(ref.current, options));

        if(!window.google){
            //Create a html element with a script tag in the DOM
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcPj2Lex4W5AXEhwsPQ02lAG8Axsn2hQg&libraries=places';
            document.head.append(script);
            script.addEventListener('load', createMap);
            console.log('and now there is a map');
            return () => script.removeEventListener('load', createMap);
        } else{
            createMap();
            console.log('and now there is a map');
        }

    }, [options.center.lat]);

    if(props.map){
        console.log('the map exists');
    }else{
        console.log('there is no map');
    }


    return(
        <div id="map-div"
            style={{ height: props.mapDimensions.height, width: props.mapDimensions.width,
            position: 'absolute'}}
            ref={ref}>
        </div>
    )
}

function MapContainer(props){
    console.log('MapContainer is rendering');
    //mapp and map options
    const [map, setMap] = React.useState();
    const [options, setOptions] = React.useState({
        center: {lat: 37.77397, lng: -122.431297},
        zoom: 10
    });
    const [markers, setMarkers] =  React.useState([]);
    const mapDimensions = {
        width: '100%',
        height: '100%'
    }

    if (map){
        console.log('Hi, there is a map');
        console.log(markers);
        console.log(props.count);
        let curMarkers = [];

        if(props.count > 1 && props.data.length !== markers.length){
            console.log('deleting previous markers');
            //deleting the previous markers
            for(const marker of markers){
                marker.setMap(null);
            }
        }

        //creating markers at first search or creating markers after first search
        if((props.data.length !== 0 && markers.length === curMarkers.length)||
            (props.count > 1 && props.data.length !== markers.length)){
            console.log(props.data);

            //create markers with an Info container
            for(const parkinglot of props.data){
                let address = parkinglot['location']['display_address'].join(', ');
                let lat = parkinglot['coordinates']['latitude'];
                let lng = parkinglot['coordinates']['longitude'];

                const parkinglotInfo = new google.maps.InfoWindow();
                const parkingInfoContent = (`
                    <div class="window-content">
                        <ul class="parkinglot-info">
                            <li><b>Address: </b>${address}</li>
                            <li><b>Name: </b>${parkinglot['name']}</li>
                            <li><b>rating: </b>${parkinglot['rating']}</li>
                        </ul>
                    </div>
                `);

                const parkinglotMarker = new window.google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    title: `${parkinglot['name']}`,
                    map: map
                });

                curMarkers.push(parkinglotMarker);

                parkinglotMarker.addListener('click', () => {
                    parkinglotInfo.close();
                    parkinglotInfo.setContent(parkingInfoContent);
                    parkinglotInfo.open(map, parkinglotMarker);
                });

                //relocate the map center
                map.setCenter({lat:lat, lng:lng});

                setMarkers(curMarkers);
            }
        }
    }
    
    const MainMap = React.useCallback(
        <MapComponent
            map={map} 
            setMap={setMap}
            options={options}
            mapDimensions={mapDimensions}
        />, [options]);

    return (
        <div id="map-container">
            {MainMap}
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#app'))