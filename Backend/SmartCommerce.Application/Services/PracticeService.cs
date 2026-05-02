using Microsoft.EntityFrameworkCore;
using SmartCommerce.Application.DTOs;
using SmartCommerce.Application.Interfaces;
using SmartCommerce.Domain.Entities;
using SmartCommerce.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Services
{
    public class PracticeService : IPracticeService
    {
        private readonly AppDbContext _context;

        public PracticeService(AppDbContext context)
        {
            _context = context;
        }

        public List<Practice> GetAll()
        {
            return _context.Practices.ToList();
        }

        public Practice GetById(int id)
        {
            return _context.Practices.FirstOrDefault(p => p.Id == id);
        }

        public void Add(Practice practice)
        {
            _context.Practices.Add(practice);
            _context.SaveChanges();
        }
    }
}
