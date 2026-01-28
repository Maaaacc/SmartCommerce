using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartCommerce.Application.Common;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Application.Services;
using SmartCommerce.Domain.Entites;
using System.Text.Json;

namespace SmartCommerce.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return View(dto);

            var (Succeeded, Message) = await _accountService.RegisterAsync(dto);

            TempData["Notification"] = JsonSerializer.Serialize(
                new Notification(Message, Succeeded ? NotificationType.Success : NotificationType.Error)
            );

            if (Succeeded)
                return RedirectToAction("Login"); 

            return View(dto);
        }


        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
                return View(dto);

            var result = await _accountService.LoginAsync(dto);

            if (result.Succeeded)
            {
                TempData["Notification"] = JsonSerializer.Serialize(
                    new Notification("Login successful!", NotificationType.Success)
                );
                return RedirectToAction("Index", "Home");
            }

            TempData["Notification"] = JsonSerializer.Serialize(
                new Notification("Invalid email or password.", NotificationType.Error)
            );

            return View(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _accountService.LogoutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}
