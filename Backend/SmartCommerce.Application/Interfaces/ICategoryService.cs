using SmartCommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Interfaces
{
    public interface ICategoryService
    {
        IAsyncEnumerable<CategoryDto> GetAllAsync();
        IAsyncEnumerable<CategoryDto> GetActiveAsync();
        IAsyncEnumerable<CategoryDto> GetDeletedAsync();

        Task<CategoryDto?> GetByIdAsync(int id);
        Task<CategoryDto> CreateAsync(CategoryDto category);
        Task<CategoryDto> UpdateAsync(CategoryDto category);
        Task<bool> DeleteAsync(int id);
        Task<bool> RestoreAsync(int id);
    }
}
