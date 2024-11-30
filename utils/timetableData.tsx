
const endpoints = {
    version: '/version',
    classes: '/classes?',
    timetable: '/timetable?'
}

export async function getData(url: string) {
    const version = await fetch(`${url}${endpoints.classes}name=SIIS`)
    .then(x => x.json())
    .then(y => {return y})
    .catch(err => {console.error("ERROR: " + err); return null})

    

    if(version == null || version.status != 200){
        alert("error getting data | " + ((version == null) ? "null" : version.status))
        return
    }

    console.log(version.data)
}