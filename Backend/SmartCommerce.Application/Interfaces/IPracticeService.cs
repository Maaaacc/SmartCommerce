using SmartCommerce.Application.DTOs;
using SmartCommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartCommerce.Application.Interfaces
{
    public interface IPracticeService
    {
        List<Practice> GetAll();
        Practice GetById(int id);
        void Add(Practice dto);
    }
}
