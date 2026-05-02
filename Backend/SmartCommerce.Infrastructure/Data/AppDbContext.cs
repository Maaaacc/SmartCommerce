using Microsoft.EntityFrameworkCore;
using SmartCommerce.Domain.Entities;

namespace SmartCommerce.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Practice> Practices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product Configuration
            modelBuilder.Entity<Product>(product =>
            {
                product.Property(p => p.Price)
                       .HasColumnType("decimal(18,2)");

                product.HasOne(p => p.Category)
                       .WithMany(c => c.Products)
                       .HasForeignKey(p => p.CategoryId)
                       .OnDelete(DeleteBehavior.SetNull);
            });

            // Category Configuration
            modelBuilder.Entity<Category>(category =>
            {
                category.Property(c => c.Name)
                        .IsRequired()
                        .HasMaxLength(100);

                category.Property(c => c.Description)
                        .HasMaxLength(500);

                // Self-referencing (Parent-Child)
                category.HasOne(c => c.Parent)
                        .WithMany(c => c.Children)
                        .HasForeignKey(c => c.ParentId)
                        .OnDelete(DeleteBehavior.Restrict);

                category.HasIndex(c => c.ParentId);
            });
        }
    }
}

