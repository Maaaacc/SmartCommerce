using Microsoft.AspNetCore.Mvc;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entities;

namespace SmartCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PracticeController : ControllerBase
    {
        private readonly IPracticeService _practiceService;

        public PracticeController(IPracticeService practiceService)
        {
            _practiceService = practiceService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_practiceService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            return Ok(_practiceService.GetById(id));
        }

        [HttpPost]
        public IActionResult Add(Practice practice)
        {
            _practiceService.Add(practice);
            return Ok("Product addedd successfully");
        }
    }
}
