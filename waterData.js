




$.getJSON('https://waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&site_no=01646500&parm_cd=00060&period=7&cacheTime=1628382024295',  // url
            function(data){
              console.log(data)

cacheDtTm = new Date().getTime();


$("#detail_show").show("slow");
param = 0060
hydrograph_url = 'http://waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&site_no=' + e.features[0].properties.river_gauge + '&parm_cd=00060&period=7&cacheTime=' + cacheDtTm;
hydrograph = '<a onclick="modal_window();"><img src="'+hydrograph_url+'" height="133" width="200" alt="Hydrograph for site ' + e.features[0].properties.river_gauge
        + ' and parameter ' + parm + '. Click to see a full size image." title="Hydrograph for site ' + e.features[0].properties.river_gauge + ' and parameter ' + parm
        + '. Click to see a full size image." /></a>';

  });
















  $.getJSON('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=12134500&period=P4D&parameterCd=00060&siteStatus=all',  // url
              function(data){

              });
