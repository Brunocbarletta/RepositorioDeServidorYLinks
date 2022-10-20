
 let respuesta;
 GetLinks(); 

 //declaracion de variables
 let h = 1000; //altura 
 let w = 1500; //Ancho 
 
 //Links Variables
 let contV = 0 ; //contador de visitas a cada link
 let HI = 50; //heigth Imagen
 let ImagenGrande;
 let Imagennormal;
 
 //separacion entre un circulo y otro.
 let separacion = 200;
 
 //Creo radio, x e y para cada circulo.
 let cx = 200; //Dinamico
 let cy = 200; //estatico
 let cr = 10; //Dinamico
 
 /*
    TEST
    Links= [["3","google","https://www.google.com.ar/","Fotos/googleIcono.png","2"],["5","youtube","https://www.youtube.com/","Fotos/youtubeIcono.png","1"],["4","inmokey","https://www.inmokey.com/","Fotos/inmokeyIcono.png","5"],["1","facebook","https://www.facebook.com/","Fotos/FacebookIcono.jpg","3"]];
    Links2=[[Respuesta[0].ID,Respuesta[0].Nombre,Respuesta[0].Link,Respuesta[0].Url,Respuesta[0].Visitas],[Respuesta[1].ID,Respuesta[1].Nombre,Respuesta[1].Link,Respuesta[1].Url,Respuesta[1].Visitas],[Respuesta[2].ID,Respuesta[2].Nombre,Respuesta[2].Link,Respuesta[2].Url,Respuesta[2].Visitas],[Respuesta[3].ID,Respuesta[3].Nombre,Respuesta[3].Link,Respuesta[3].Url,Respuesta[3].Visitas]];
 */
 
 
//elemento SVG
let svg = d3.select("body")
.append("svg")//crea el svg
.attr("width", w)//aplica ancho
.attr("height", h);//aplica largo

setTimeout(Graficar,800);

function Graficar() {
    console.log("graficando");

    let ImagenesLinks = svg.selectAll("g")
    .data(respuesta)
    .enter()
    .append("g")
    .append("a")
    .attr("href", function(d) {
        // Setea direccion de la pagina del icono.
        return d["Link"];
    })
    .attr( "target","_blank")
    .append("image")
    .attr("xlink:href", function(d) {
        // Setea icono
        return d["Url"];
    })
    .attr("x",function(d) {
        // Espaciado entre iconos
        cx = cx + separacion;
        return cx;
    })
    .attr("idnombre",function(d) {
        return d["Nombre"];
    })
    .attr("id", function(d) {
        return d["ID"].toString();
    })
    .attr("y", cy)
    .attr("r", cr)
    .attr("height", 50)
    .attr("width", 50)
    .on("click", function(d) {
        //la funcion principal de onclick es sumar 1 y enviarlo a la base de datos.
        let visitas = respuesta[ d["ID"] ].Visitas + 1;
        let data = { "Visitas" : visitas.toString() }
        $.ajax({
            type: 'PUT',
            url: "/actualizar/"+d["ID"]+"",
            contentType: 'application/json',
            data: JSON.stringify(data), // access in body
        }).done(function () {
            console.log('SUCCESS');
        }).fail(function (msg) {
            console.log('FAIL');
        }).always(function (msg) {
            console.log('ALWAYS');
        });

        //ImagenesLinks;
    })
    .on("mouseover", function(d) { 
        //ImagenGrande = ImagenesLinks.transition()
        ImagenesLinks.transition()
        .duration(1000)
        .attr("height", function(d) {
            contV = respuesta[d["ID"]].Visitas;
            return HI*contV;
        })
        .attr("width",function(d) {
            contV = respuesta[d["ID"]].Visitas;
            return HI*contV;
        });

        //ImagenGrande;
    })
    .on("mouseout", function() {
        //magennormal = ImagenesLinks.transition().duration(1000).attr("y",cy).attr("r",cr).attr("height",50).attr("width",50);
        //Imagennormal;
        ImagenesLinks.transition()
        .duration(1000)
        .attr("y",cy)
        .attr("r",cr)
        .attr("height",50)
        .attr("width",50);
    });
}
    
 //////////////////////////////Prueba GET/////////////////////////////
function GetLinks() {
    $.ajax({
        url: '/paginas',
        success: function(response) {
        respuesta = response;
        console.log(respuesta);
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
 };
 
 ////////////////////////RESETEAR//////////////////////////////////////////////
function Resetear() {
    datos = "nada";
    $.ajax({
        type: 'PUT',
        url: "/actualizarTodos",
    }).done(function () {
        console.log('SUCCESS');
    }).fail(function (msg) {
        console.log('FAIL');
    }).always(function (msg) {
        console.log('ALWAYS');
    });

    Refrescar();
}
 
////////////////////////////////Refrescar/////////////////////////////////////////
function Refrescar() {
    GetLinks();
    setTimeout(Graficar,800);
    console.log("Actualizado");
}
