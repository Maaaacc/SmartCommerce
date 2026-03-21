
using Microsoft.EntityFrameworkCore;
using SmartCommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users {  get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var product = modelBuilder.Entity<Product>();
            product.Property(p => p.Price)
                   .HasColumnType("decimal(18,2)");

            var category = modelBuilder.Entity<Category>();
            category.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(100);

            category.Property(c => c.Description)
                    .HasMaxLength(500);
            
        }

    }
}
