using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldCities.Data;
using WorldCities.Data.Models;

namespace WorldCities.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]

    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<CountryDTO>>> GetCountries(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            return await ApiResult<CountryDTO>.CreateAsync(
                _context.Countries.Select(c => new CountryDTO()
                {
                    Id = c.Id,
                    Name = c.Name,
                    ISO2 = c.ISO2,
                    ISO3 = c.ISO3,
                    TotCities = c.Cities.Count
                }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery
            );
        }

        [HttpPost]
        public async Task<ActionResult<ApiResult<Country>>> PostCountry(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCity", new { id = country.Id }, country);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(int id)
        {
            Country country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCountry(int id, Country country)
        {
            if (id != country.Id)
            {
                return BadRequest();
            }

            _context.Entry(country).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(int countryId, string fieldName, string fieldValue)
        {
            switch (fieldName)
            {
                case "name":
                    return _context.Countries.Any(c => c.Name == fieldValue && c.Id != countryId);
                case "iso2":
                    return _context.Countries.Any(c => c.ISO2 == fieldValue && c.Id != countryId);
                case "iso3":
                    return _context.Countries.Any(c => c.ISO3 == fieldValue && c.Id != countryId);
                default:
                    return false;
            }
        }

        private bool CountryExist(int id)
        {
            return _context.Countries.Any(e => e.Id == id);
        }
    }
}