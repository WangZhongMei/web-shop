$(function(){
    includeHeaderAndFooter();
});
function includeHeaderAndFooter(){
    var html=$.get('http://localhost:8080/static/header.html',function (data) {		
		    var render = template.compile(data);
		    $("body").prepend(render);
		})
		
		var html=$.get('http://localhost:8080/static/footer.html',function (data) {
		    var render = template.compile(data);
		    $("body").append(render);
		})
}