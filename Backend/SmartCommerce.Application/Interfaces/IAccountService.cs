using SmartCommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Interfaces
{
    public interface IAccountService
    {
        Task<(bool Succeeded, string Message)> RegisterAsync(RegisterDto dto);
        Task<(bool Succeeded, string Message)> LoginAsync(LoginDto dto);
        Task LogoutAsync();
    }
}
