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
    public class MovieApiController : ApiController
    {
        public async Task<IHttpActionResult> Get(string source, string id)
        {
            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(string.Format("https://webjetapitest.azurewebsites.net/api/{0}/movie/{1}", source, id)),
                Method = HttpMethod.Get,
            };
            request.Headers.TryAddWithoutValidation("x-access-token", ConfigurationManager.AppSettings["apiToken"]);

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.Timeout = TimeSpan.FromSeconds(10);

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
