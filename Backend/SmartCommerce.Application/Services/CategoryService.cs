using Microsoft.EntityFrameworkCore;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entities;
using SmartCommerce.Infrastructure.Data;

namespace SmartCommerce.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async IAsyncEnumerable<CategoryDto> GetAllAsync()
        {
            var query = _context.Categories
                .AsNoTracking()
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    IsDeleted = c.IsDeleted,
                    ParentId = c.ParentId
                })
                .AsAsyncEnumerable();

            await foreach (var category in query)
            {
                yield return category;
            }
        }

        public async IAsyncEnumerable<CategoryDto> GetActiveAsync()
        {
            var query = _context.Categories
                .Where(c => !c.IsDeleted)
                .AsNoTracking(); 

            var result = query.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsDeleted = c.IsDeleted,
                ParentId = c.ParentId
            }).AsAsyncEnumerable();

            await foreach (var category in result)
            {
                yield return category;
            }
        }
        public async IAsyncEnumerable<CategoryDto> GetDeletedAsync()
        {
            var query = _context.Categories
                .IgnoreQueryFilters()
                .Where(c => c.IsDeleted) 
                .AsNoTracking();

            var result = query.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsDeleted = c.IsDeleted,
                ParentId = c.ParentId
            }).AsAsyncEnumerable();

            await foreach (var category in result)
            {
                yield return category;
            }
        }
        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _context.Categories
                .Where(c => !c.IsDeleted && c.Id == id)
                .FirstOrDefaultAsync();

            if (category == null) return null;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentId = category.ParentId
            };
        }

        public async Task<CategoryDto> CreateAsync(CategoryDto dto)
        {
            if (dto.ParentId.HasValue)
            {
                var parent = await _context.Categories.FindAsync(dto.ParentId.Value);
                if(parent == null)
                {
                    throw new ArgumentException("Parent category not found.");
                }
            }
            
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                ParentId = dto.ParentId,
                IsDeleted = false
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            dto.Id = category.Id;
            return dto;
        }

        public async Task<CategoryDto> UpdateAsync(CategoryDto dto)
        {
            Console.WriteLine($"UpdateAsync: id={dto.Id}, parent_id={dto.ParentId}");

            var category = await _context.Categories.FindAsync(dto.Id);
            if (category == null)
                throw new Exception("Category not found");

            if (dto.ParentId.HasValue)
            {
                var parent = await _context.Categories.FindAsync(dto.ParentId.Value);
                if (parent == null)
                    throw new ArgumentException("Parent category not found.");
            }

            // Log current state
            Console.WriteLine($"Before update: ParentId = {category.ParentId}");

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.ParentId = dto.ParentId;

            // Log right before Save
            Console.WriteLine($"Before SaveChanges: ParentId = {category.ParentId}");

            await _context.SaveChangesAsync();

            // Log after Save
            Console.WriteLine($"After SaveChanges: ParentId = {category.ParentId}");

            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            category.IsDeleted = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RestoreAsync(int id)
        {
            var category = await _context.Categories
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null) return false;

            category.IsDeleted = false;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}