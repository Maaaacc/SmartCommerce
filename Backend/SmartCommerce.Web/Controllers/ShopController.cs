using Microsoft.AspNetCore.Mvc;
using SmartCommerce.Application.DTOs;

namespace SmartCommerce.Web.Controllers
{
    public class ShopController : Controller
    {
        private readonly HttpClient _client;

        public ShopController(IHttpClientFactory httpClientFactory)
        {
            _client = httpClientFactory.CreateClient("ApiClient");
        }

        public async Task<IActionResult> Index()
        {
            var products = await _client.GetFromJsonAsync<IEnumerable<ProductDto>>("products");

            return View(products);
        }

        public async Task<IActionResult> Details(int id)
        {
            var product = await _client.GetFromJsonAsync<ProductDto>($"products/{id}");
            if (product == null) return NotFound();
            return View(product);
        }
    }

}
