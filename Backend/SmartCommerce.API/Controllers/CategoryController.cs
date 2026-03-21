using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entities;

namespace SmartCommerce.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = new List<CategoryDto>();
            await foreach (var category in _categoryService.GetAllAsync())
            {
                categories.Add(category);
            }
            return Ok(categories);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var categories = new List<CategoryDto>();
            await foreach (var category in _categoryService.GetActiveAsync())
                categories.Add(category);

            return Ok(categories);
        }

        [HttpGet("deleted")]
        public async Task<IActionResult> GetDeleted()
        {
            var categories = new List<CategoryDto>();
            await foreach (var category in _categoryService.GetDeletedAsync())
                categories.Add(category);

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null) return NotFound("Category not found");
            return Ok(category);
        }

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            var category = await _categoryService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
        {
            dto.Id = id;
            var category = await _categoryService.UpdateAsync(dto);
            if (category == null) return NotFound("Category not found");
            return Ok(category);
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _categoryService.DeleteAsync(id);
            if (!result) return NotFound("Category not found");
            return NoContent();
        }

        [HttpPatch("{id}/restore")]
        public async Task<IActionResult> Restore (int id)
        {
            var result = await _categoryService.RestoreAsync(id);
            if (!result) return NotFound("Category not found");
            return Ok("Category restored succeesfully");
        }
    }
}
