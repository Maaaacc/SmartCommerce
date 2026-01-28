using Microsoft.AspNetCore.Mvc;
using Moq;
using NuGet.Frameworks;
using SmartCommerce.API.Controllers;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Tests.ProductsControllerTest
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductService> _mockService;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockService = new Mock<IProductService>();
            _controller = new ProductsController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult()
        {
            // Arrange
            var products = new List<ProductDto>
            {
                new ProductDto { Id = 1, Name = "Test Product"}
            };

            _mockService.Setup(s => s.GetAllAsync())
                .ReturnsAsync(products);

            // Act
            var result = await _controller.GetAll();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetById_ReturnsOk_WhenProductExists()
        {
            // Arrange
            var product = new ProductDto { Id = 1, Name = "Test Product" };

            _mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync(product);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);

            var returnProduct = Assert.IsType<ProductDto>(okResult.Value);
            Assert.Equal(1, returnProduct.Id);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenProductDoesNotExists()
        {
            // Arrange
            _mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync((ProductDto)null);

            // Act
            var result = await _controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
