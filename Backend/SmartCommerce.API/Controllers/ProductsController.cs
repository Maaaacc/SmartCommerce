using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;

namespace SmartCommerce.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("deleted")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeleted()
        {
            var products = await _productService.GetDeletedAsync();
            return Ok(products);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = new List<ProductDto>();

            await foreach(var product in _productService.GetAllAsync())
            {
                products.Add(product);
            }    

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(ProductDto dto)
        {
            var product = await _productService.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, ProductDto dto)
        {
            if (id != dto.Id) return BadRequest();

            var product = await _productService.UpdateAsync(dto);

            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _productService.DeleteAsync(id);

            if(!deleted) return NotFound();

            return NoContent();
        }

        [HttpPatch("{id}/restore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Restore(int id)
        {
            try
            {
                await _productService.RestoreAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file,[FromForm] string oldImageUrl = null)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.ContentType.StartsWith("image/"))
                return BadRequest("Only image files allowed");

            var uploadsPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/uploads/products"
            );

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var newFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsPath, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (!string.IsNullOrEmpty(oldImageUrl))
            {
                var oldFileName = Path.GetFileName(oldImageUrl);

                var oldFilePath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/uploads/products",
                    oldFileName
                );

                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                    Console.WriteLine($"Deleted old image: {oldFilePath}");
                }
            }

            var imageUrl = $"/uploads/products/{newFileName}";
            return Ok(new { imageUrl });
        }
    }
}
