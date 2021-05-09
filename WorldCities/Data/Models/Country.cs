using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WorldCities.Data.Models
{
    public class Country
    {
        [Key]
        [Required]
        public int Id { get; set; }

        public string Name { get; set; }

        public string ISO2 { get; set; }

        public string ISO3 { get; set; }

        public virtual List<City> Cities { get; set; }
    }
}
