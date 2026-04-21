using SmartCommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Interfaces
{
    public interface IProductService
    {
        IAsyncEnumerable<ProductDto> GetAllAsync();
        Task<IEnumerable<ProductDto>> GetDeletedAsync();   
        Task<ProductDto> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(ProductDto product);
        Task<ProductDto> UpdateAsync(ProductDto product);
        Task<bool> DeleteAsync(int id);
        Task RestoreAsync(int id);                       

    }
}
