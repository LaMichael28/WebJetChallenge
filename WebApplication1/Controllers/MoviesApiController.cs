using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace WebApplication1.Controllers
{
    public class MoviesApiController : ApiController
    {
        public async Task<IHttpActionResult> Get(string source)
        {
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(string.Format("https://webjetapitest.azurewebsites.net/api/{0}/movies", source)),
                Method = HttpMethod.Get
            }; 
            request.Headers.TryAddWithoutValidation("x-access-token", ConfigurationManager.AppSettings["apiToken"]);

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(20);

                var result = await httpClient.SendAsync(request);

                if (result.StatusCode == HttpStatusCode.OK)
                {

                    var json = JsonConvert.DeserializeObject(await result.Content.ReadAsStringAsync());
                    return Json(json);
                }
                else
                {
                    return BadRequest(result.ReasonPhrase);
                }
            }
        }
    }
}
