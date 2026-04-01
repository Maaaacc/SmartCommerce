using Microsoft.EntityFrameworkCore;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entities;
using SmartCommerce.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async IAsyncEnumerable<ProductDto> GetAllAsync()
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Where(p => !p.IsDeleted)
                .AsNoTracking()
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                })
                .AsAsyncEnumerable();

            await foreach (var product in query)
            {
                yield return product;
            }
        }


        public async Task<ProductDto> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .Where(p => !p.IsDeleted && p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null) return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                Stock = product.Stock
            };
        }

        public async Task<ProductDto> CreateAsync(ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            dto.Id = product.Id;
            return dto;
        }

        public async Task<ProductDto> UpdateAsync(ProductDto dto)
        {
            var product = await _context.Products.FindAsync(dto.Id);
            if (product == null)
                throw new Exception("Product not found");

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;
            product.Stock = dto.Stock;

            await _context.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null) return false;

            product.IsDeleted = true;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
