using Microsoft.EntityFrameworkCore;
using SmartCommerce.Domain.Entities;
using SmartCommerce.Domain.Enums;
using SmartCommerce.Infrastructure.Data;
using System.Threading.Tasks;

namespace SmartCommerce.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminAsync(AppDbContext context)
        {
            // Define admin credentials
            var adminEmail = "admin@smartcommerce.com";
            var adminPassword = "Admin@12345";

            // Check if admin already exists
            var adminUser = await context.Users
                .FirstOrDefaultAsync(u => u.Email == adminEmail);

            if (adminUser == null)
            {
                // Create admin user
                adminUser = new User
                {
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = UserRole.Admin
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
