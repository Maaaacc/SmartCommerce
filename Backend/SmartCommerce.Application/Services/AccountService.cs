using Microsoft.AspNetCore.Identity;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entites;
using SmartCommerce.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        public async Task<(bool Succeeded, string Message)> RegisterAsync(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword) 
                return (false, "Passwords do not match.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, UserRole.Customer.ToString());

            return (true, "Registration successful");
        }

        public async Task<(bool Succeeded, string Message)> LoginAsync(LoginDto dto)
        {
            var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, dto.RememberMe, false);

            if (result.Succeeded) 
                return (true, "Login successful.");

            else if (result.IsLockedOut) 
                return (false, "Account locked. Try again later.");

            else 
                return (false, "Invalid login credentials.");
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

    }
}
